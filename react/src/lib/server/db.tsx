import { MongoClient } from "mongodb";
import { isArray, oid } from "../helpers";

let connected = false;
let client: MongoClient;

if (!connected) {
  const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI || "";
  console.log("====================================================");
  console.log("MONGODB CONNECTION");
  console.log("====================================================");
  console.log("MONGDB_URI      :", MONGODB_URI);
  console.log("====================================================");

  client = new MongoClient(MONGODB_URI);

  const connectToDatabase = async () => {
    await client.connect();
    return { status: "SUCCESS", message: "DatabasecConnected." };
  };

  connectToDatabase()
    .then((info) => {
      connected = true;
      console.log(info);
    })
    .catch((error) => console.log("db [ERROR] : Connection failed. ", error));
}

let db: any;
let collection: any;

const generateIds = (docs: any) => {
  docs.forEach((doc: Record<string, any>) => {
    if (!doc._id) {
      doc._id = oid();
    }
  });
};

const insert = async (
  data: Record<string, any> | Record<string, any>[],
  options = { reload: false },
) => {
  if (isArray(data)) {
    return await insertMany(data, options);
  } else {
    return await insertOne(data, options);
  }
};

const insertOne = async (
  data: Record<string, any>,
  options = { reload: false },
) => {
  try {
    if (!data._id) data._id = oid();
    const retval = await collection.insertOne(data);
    if (retval.acknowledged) {
      if (options.reload) {
        const newData = await collection.find({ _id: data._id }).toArray();
        data = newData[0];
      }
      return data;
    }
    throw Error(
      "An error was encountered saving to database. Please try again.",
    );
  } catch (err) {
    console.log("insertOne [ERROR]", err);
    throw err;
  }
};

const insertMany = async (
  data: Record<string, any>[],
  options = { reload: false },
) => {
  try {
    generateIds(data);
    const retval = await collection.insertMany(data);
    if (retval.acknowledged) {
      if (options.reload) {
        const ids = data.map((d: Record<string, any>) => d._id);
        data = await collection.find({ _id: { $in: ids } }).toArray();
      }
      return data;
    }
    throw Error(
      "An error was encountered saving the record. Please try again.",
    );
  } catch (err) {
    console.log("insertMany [ERROR]", err);
    throw err;
  }
};

const update = async (filter = {}, data = {}, options = {}) => {
  try {
    const retval = await collection.updateOne(
      filter,
      {
        $set: data,
        $currentDate: { lastModified: true },
      },
      options,
    );
    if (retval.acknowledged) {
      return retval;
    }
    throw Error(
      "An error was encountered updating the record. Please try again.",
    );
  } catch (err) {
    console.log("update [ERROR]", err);
    throw err;
  }
};

const updateMany = async (filter = {}, data = {}, options = {}) => {
  try {
    const retval = await collection.updateMany(
      filter,
      {
        $set: data,
        $currentDate: { lastModified: true },
      },
      options,
    );
    if (retval.acknowledged) {
      return retval;
    }
    throw Error(
      "An error was encountered updating the record. Please try again.",
    );
  } catch (err) {
    console.log("updateMany [ERROR]", err);
    throw err;
  }
};

const replace = async (filter = {}, data = {}, options = {}) => {
  try {
    const retval = await collection.replaceOne(filter, data, options);
    if (retval.acknowledged) {
      return retval;
    }
    throw Error(
      "An error was encountered replacing the record. Please try again.",
    );
  } catch (err) {
    console.log("replace [ERROR]", err);
    throw err;
  }
};

const deleteMany = async (filter = {}, options = {}) => {
  try {
    const retval = await collection.deleteMany(filter, options);
    if (retval.acknowledged) {
      return retval;
    }
    throw Error(
      "An error was encountered replacing the record. Please try again.",
    );
  } catch (err) {
    console.log("deleteMany [ERROR]", err);
    throw err;
  }
};

const deleteOne = async (filter = {}, data = {}, options = {}) => {
  try {
    const retval = await collection.updateOne(
      filter,
      {
        $unset: data,
        $currentDate: { lastModified: true },
      },
      options,
    );
    if (retval.acknowledged) {
      return retval;
    }
    throw Error(
      "An error was encountered updating the record. Please try again.",
    );
  } catch (err) {
    console.log("update [ERROR]", err);
    throw err;
  }
};

const find = async (filter: any, options: Record<string, any> = {}) => {
  try {
    const data = await collection.find(filter, options).toArray();
    return data.length === 0 ? null : data[0];
  } catch (err) {
    console.log("find [ERROR]", err);
    throw err;
  }
};

const getList = async (filter: any, options: Record<string, any> = {}) => {
  try {
    return await collection.find(filter, options).toArray();
  } catch (err) {
    console.log("getList [ERROR]", err);
    throw err;
  }
};

const closeChangeStream = (changeStream: any, timeInMs = 60000) => {
  const timeoutId = setTimeout(() => {
    console.log("Closing the changeStream");
    changeStream.close();
    clearTimeout(timeoutId);
  }, timeInMs);
};

export const openDb = (dbName: string, collectionName: string) => {
  db = client.db(dbName);
  collection = db.collection(collectionName);
  return {
    db,
    collection,
    insert,
    update,
    updateMany,
    replace,
    deleteMany,
    deleteOne,
    find,
    getList,
    closeChangeStream,
  };
};

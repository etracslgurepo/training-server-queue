import Service from "../lib/server/remote-service";

export const getGroups = async ({
  objid,
  lguname,
}: {
  objid: string;
  lguname: string;
}) => {
  const svc = Service.lookup("api/QueueService", "etracs");
  const group = await svc.invoke("getGroup", {
    objid,
  });
  const data: Record<string, any> = {
    objid: group.objid,
    title: group.title,
  };

  return data;
};

export const getActiveList = async ({ groupid }: { groupid: string }) => {
  const svc = Service.lookup("api/QueueMonitorService", "etracs");
  const data = await svc.invoke("getActiveList", {
    groupid,
  });
  return data;
};

export const getQueueGroup = async () => {
  const svc = Service.lookup("QueueGroupService", "etracs");
  const groups = await svc.invoke("getGroupsWithSections", null);

  const general = {
    objid: "GEN",
    title: "GENERAL",
  };
  const groupsdata: Record<string, any>[] = [
    general,       // Put general first, or wherever you want
    ...(groups || []) // Spread the actual group array
  ];


  return groupsdata;
};

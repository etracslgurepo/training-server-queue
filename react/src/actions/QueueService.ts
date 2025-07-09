"use server"

import axios from "axios";

export async function getRootOrg(): Promise<Record<string, any>> {

 const path = await `${process.env.NEXT_PUBLIC_ETRACS_SERVER_URI}/OrgService.getRoot`;
     const res = await axios.get(path)

     return res.data;
}


export async function getGroups(): Promise<[]> {
     const path = await `${process.env.NEXT_PUBLIC_ETRACS_SERVER_URI}/api/QueueService.getGroups`;
     const res = await axios.get(path)

     return res.data;

}

export async function getGroup(name: string): Promise<Record<string, any>> {
     const path = await `${process.env.NEXT_PUBLIC_ETRACS_SERVER_URI}/api/QueueService.getGroup?objid=${name}`;
     const res = await axios.get(path)

     return res.data;

}


export async function getAnnouncement(): Promise<Record<string, any>> {
     const path = await `${process.env.NEXT_PUBLIC_ETRACS_SERVER_URI}/api/QueueMonitorService.getAnnouncement`;
     const res = await axios.get(path)

     return res.data;

}
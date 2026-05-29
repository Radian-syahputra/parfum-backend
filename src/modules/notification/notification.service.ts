import prisma from "../../config/prisma";

export const getMyNotifcationService = async (userId : string) => {
    const notification = await prisma.notification.findMany({
        where : {userId},
        orderBy : {
            createdAt : 'desc'
        }
    })

    return notification
}

export const markAsReadService = async (id : string, userId : string) => {
    const notification = await prisma.notification.findUnique({where : {id}})
    if(!notification) {
        throw new Error("Notifikasi Tidak Di Temukan")
    }

    if(notification.userId !== userId) {
        throw new Error("Akses Ditolak")
    }

    const updated = await prisma.notification.update({
        where : {id},
        data :{
            status : "READ"
        }
    })

    return updated
}

export const markAllAsReadService  = async (userId : string) => {
    await prisma.notification.updateMany({
        where : {userId, status : "UNREAD"},
        data : {
            status : "READ"
        }
    })

    return {message : "Semua notifikasi telah dibaca"}
}
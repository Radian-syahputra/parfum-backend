import prisma from "../../config/prisma";
import { BottleSize, Concentration, OrderStatus } from "@prisma/client";

interface OrderItemInput {
  productId: string;
  bottleSize: BottleSize;
  concentration: Concentration;
  quantity: number;
}

export const createOrderService = async (
  userId: string,
  items: OrderItemInput[]
) => {
  let totalPrice = 0;

  // Validasi Product Untuk Hitung Harga
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Produk dengan id ${item.productId} tidak ditemukan`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stok produk ${product.name} tidak mencukupi`);
      }

      const itemPrice = product.price * item.quantity;
      totalPrice += itemPrice;

      return {
        productId: item.productId,
        bottleSize: item.bottleSize,
        concentration: item.concentration,
        quantity: item.quantity,
        price: itemPrice,
      };
    })
  );

  //   Buat Order Dan Kurangi stock Product
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalPrice,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Kurangi Stock
    await Promise.all(
      items.map((item) => {
        tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      })
    );

    // Buat Notifikasi
    await tx.notification.create({
      data: {
        userId,
        orderId: newOrder.id,
        message: `Pesanan #${newOrder.id} berhasil dibuat, menunggu konfirmasi.`,
      },
    });

    return newOrder;
  });

  return order;
};

export const getMyOrdersService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

export const getOrderByIdService = async (
  id: string,
  userId: string,
  role: string
) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Pesanan Tidak Ditemukan");
  }

  // Costummer hanya Bisa Melihat Pesanan Miliknya saja
  if (role !== "ADMIN" && order.userId !== userId) {
    throw new Error("Akses Ditolak");
  }

  return order;
};

export const getAllOrdersService = async () => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

export const updateOrderStatusService = async (
  id: string,
  status: OrderStatus
) => {
  const order = await prisma.order.findUnique({where: { id }});

  if(!order) {
    throw new Error("Pesanan Tidak Di Temukan")
  }

  const updatedOrder = await prisma.$transaction( async (tx) => {
    const updated = await tx.order.update({
        where : {id},
        data :{status}
    })

    // Buat Notifikasi update Status
    await tx.notification.create({
        data : {
            userId : order.userId,
            orderId : id,
            message : `Status pesanan #${id} telah diupdate menjadi ${status}`
        }
    })

    return updated
  })

  return updatedOrder
};

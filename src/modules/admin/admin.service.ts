import prisma from "../../config/prisma";

export const getDashboardStatsService = async () => {
  const [totalusers, totalProducts, totalOrders, orders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      select: {
        totalPrice: true,
        status: true,
      },
    }),
  ]);

  const totalRevenue = orders
    .filter((order) => order.status === "DELIVERED")
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const ordersByStatus = {
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
    SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return {
    totalusers,
    totalProducts,
    totalOrders,
    totalRevenue,
    ordersByStatus,
  };
};

export const getAllUserService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

export const deleteUserService = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User Tidak Ditemukan");
  }

  if (user.role === "ADMIN") {
    throw new Error("Akun Admin Tidak Bisa Di Hapus");
  }

  await prisma.user.delete({
    where: { id },
  });

  return user;
};

export const updateUserRoleService = async (
  id: string,
  role: "ADMIN" | "CUSTOMER"
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if(!user) {
    throw new Error("User Tidak Ditemukan")
  }

  const updated = await prisma.user.update({
    where : {id},
    data : {role},
    select : {
        id : true,
        name : true,
        email : true,
        role : true
    }
  })

  return updated

};

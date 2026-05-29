import prisma from "../../config/prisma";

export const addToWishlistService = async (
  userId: string,
  productId: string
) => {
  // check apkah product ada
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Produk tidak ditemukan");
  }

  // check apakah product sudah ada dalam wishlist belum
  const existingWishlist = await prisma.wishlist.findFirst({
    where: { userId, productId },
  });
  if (existingWishlist) {
    throw new Error("Produk sudah ada di wishlist");
  }

  const wishlist = await prisma.wishlist.create({
    data: { userId, productId },
    include: {
      product: true,
    },
  });

  return wishlist;
};

export const getMyWishListService = async (userId: string) => {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return wishlist;
};

export const removeFromWishlistService = async (
  id: string,
  userId: string
) => {
  // Check apakah wishlist ada atau belum
  const wishlist = await prisma.wishlist.findUnique({ where: { id } });
  if (!wishlist) {
    throw new Error("Wishlist tidak ditemukan");
  }

  if(wishlist.userId !== userId) {
    throw new Error("Akses Ditolak")
  }

  await prisma.wishlist.delete({where : {id}})

  return wishlist
};

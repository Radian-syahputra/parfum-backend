import prisma from "../../config/prisma";

export const createReviewService = async (
  userId: string,
  productId: string,
  rating: number,
  comment?: string
) => {
  // check apakah user sudah pernah review product ini
  const existingRevew = await prisma.review.findFirst({
    where: { userId, productId },
  });
  if (existingRevew) {
    throw new Error("kamu Sudah Memberikan Review Product Ini");
  }

  // check apakah user pernah membeli product ini
  const hasBought = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: "DELIVERED",
      },
    },
  });

  if (!hasBought) {
    throw new Error("Kamu Harus Membeli Product Ini Dulu");
  }

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

export const getProductReviewService = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  //   Hitng Rata -rata rating
  const avrageRating =
    (reviews.length) > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return { reviews, avrageRating };
};

export const deleteReviewService = async (id : string, userId : string, role : string) => {
    const review = await prisma.review.findUnique({where : {id}})
    if(!review) {
        throw new Error("Review tidak ditemukan")
    }

    // hanya pemilik review atau admin yang bisa menghapus 
    if(role !== "ADMIN" && review.userId !== userId) {
        throw new Error("Akses Ditolak")
    }

    await prisma.review.delete({where : {id}})

    return review
}

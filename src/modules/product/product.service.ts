import prisma from "../../config/prisma";
import cloudinary from "../../config/cloudinary";
import { Category } from "@prisma/client";

export const createProductService = async (
  name: string,
  description: string,
  price: number,
  stock: number,
  category: Category,
  fileBuffer?: Buffer,
  fileName?: string
) => {
  let imageUrl = null;
  // Upload gambar Ke cloudinary
  if (fileBuffer && fileName) {
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "parfum",
            public_id: fileName,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(fileBuffer);
    });
    imageUrl = uploadResult.secure_url;
  }

  //   Create Data Base
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      category,
      image: imageUrl,
    },
  });

  // Mengembalikan Nilai atau data product
  return product;
};

export const getAllProductService = async (
  search?: string,
  category?: Category
) => {
  const products = await prisma.product.findMany({
    where: {
      //  kalau search = "sabun"  → hasil: { name: { contains: "sabun" } }
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
      ...(category && { category }),
    },
    //  urutkan data berdasarkan createdAt secara descending (terbaru di atas).
    orderBy: {  
      createdAt: "desc",
    },
  });

  return products;
};

export const getProductByIdService = async (id: string) => {
  // mengambil 1 produk berdasarkan ID, sekaligus mengambil reviews-nya, dan di setiap review juga mengambil data user yang membuat review tersebut.
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw new Error("Product Tidak Di Temukan");
  }

  return product;
};

export const updateProductByIdService = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: Category;
  },
  fileBuffer?: Buffer,
  fileName?: string
) => {
  let imageUrl;

  if (fileBuffer && fileName) {
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "parfum", public_id: fileName },
          (error, reslut) => {
            if (error) reject(error);
            else resolve(reslut);
          }
        )
        .end(fileBuffer);
    });

    imageUrl = uploadResult;
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      // ...data -> sebarkan semua isi dari objek data
      ...data,
      ...(imageUrl && { image: imageUrl }),
    },
  });

  return product;
};

export const deleteProductService = async (id: string) => {
  const product = await prisma.product.findUnique({where: { id }});

  if(!product) {
    throw new Error("Product Tidak Di Temukan")
  }

  await prisma.product.delete({where : {id}})

  return product
};

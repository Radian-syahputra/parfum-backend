import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";

export const registerService = async (
  name: string,
  email: string,
  password: string
) => {

  // Check Apakah Email Sudah Terdaftar Atau Belum
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("Email Sudah Terdaftar");
  }

  // Hash atau ubah password dari 12345678 -> sakfaff7faufe3fsa
  const hashedPassword = await bcrypt.hash(password, 10);

  // Bikin akunnya
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginService = async (email: string, password: string) => {
  // Check apakah Email benar atau salah
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Email atau password salah");
  }

  // Check apakah password yang di input sama kayak password di database 
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid) {
    throw new Error("Email Atau Password Salah")
  }

  // Pembuatan Token
  const token = jwt.sign({id : user.id, role : user.role}, process.env.JWT_SECRET, {
    expiresIn : "7d"
  })

  return {
    token, 
    user : {
        id : user.id,
        name : user.name,
        email : user.email,
        role : user.role,

    }
  }

};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const professor = await prisma.professor.create({
            data: req.body
        });
        return res.status(201).json(professor);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const professors = await prisma.professor.findMany();
    return res.json(professors);
}

const readOne = async (req, res) => {
    try {
        const professor = await prisma.professor.findUnique({
            select: {
                id: true,
                nome: true,
                email: true,
                senha: true,
                turmas: true
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(professor);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const professor = await prisma.professor.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(professor);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.professor.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  try {
    const professor = await prisma.professor.findUnique({
      where: { email: email },
    });

    if (!professor || professor.senha !== senha) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso",
      professor: {
        id: professor.id,
        nome: professor.nome,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};


module.exports = { create, read, readOne, update, remove, login };
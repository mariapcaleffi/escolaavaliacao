const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const turma = await prisma.turma.create({
            data: req.body
        });
        return res.status(201).json(turma);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const read = async (req, res) => {
    const turmas = await prisma.turma.findMany(
        {
            where: {
                professorId: Number(req.params.id)
            }
        }
    );
    return res.json(turmas);
}

const readOne = async (req, res) => {
    try {
        const turma = await prisma.turma.findUnique({
            select: {
                id: true,
                nome: true,
                professorId: true,
                atividades: true
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(turma);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const turma = await prisma.turma.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(turma);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.turma.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

module.exports = { create, read, readOne, update, remove };
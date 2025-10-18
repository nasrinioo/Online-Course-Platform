const prisma = require("../../config/database");

exports.findById = async (id) => {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          imageUrl: true,
          isPublished: true,
          isFeatured: true,
          difficulty: true,
          duration: true,
          language: true,
          tags: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

exports.findByName = async (name) => {
  return await prisma.category.findUnique({
    where: { name },
  });
};

exports.create = async (categoryData) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.category.create({
      data: categoryData,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        isActive: true,
        createdAt: true,
      },
    });
  });
};

exports.findAll = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          courses: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
};

exports.findAllWithCourses = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    include: {
      courses: {
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          imageUrl: true,
          isFeatured: true,
          difficulty: true,
          duration: true,
          language: true,
          tags: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          courses: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
};

exports.update = async (id, updateData) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.category.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        isActive: true,
        updatedAt: true,
      },
    });
  });
};

exports.delete = async (id) => {
  return await prisma.$transaction(async (tx) => {
    // Check if category has courses
    const categoryWithCourses = await tx.category.findUnique({
      where: { id },
      include: {
        courses: {
          select: { id: true },
        },
      },
    });

    if (categoryWithCourses.courses.length > 0) {
      throw new Error("Cannot delete category with existing courses");
    }

    return await tx.category.delete({
      where: { id },
    });
  });
};

exports.search = async (searchTerm) => {
  return await prisma.category.findMany({
    where: {
      AND: [
        { isActive: true },
        {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          courses: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
};

exports.getStats = async () => {
  const totalCategories = await prisma.category.count();
  const activeCategories = await prisma.category.count({
    where: { isActive: true },
  });
  const categoriesWithCourses = await prisma.category.count({
    where: {
      AND: [
        { isActive: true },
        {
          courses: {
            some: {
              isPublished: true,
            },
          },
        },
      ],
    },
  });

  return {
    total: totalCategories,
    active: activeCategories,
    withCourses: categoriesWithCourses,
  };
};

exports.toggleActiveStatus = async (id) => {
  return await prisma.$transaction(async (tx) => {
    const category = await tx.category.findUnique({
      where: { id },
      select: { isActive: true },
    });

    return await tx.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });
  });
};

exports.getCategoriesWithCourseCount = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      _count: {
        select: {
          courses: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
};

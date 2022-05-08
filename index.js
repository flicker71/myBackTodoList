
async function main() {
    // await prisma.user.create({
    //   data: {
    //     firstName: 'Alice',
    //     lastName: 'Test',
    //     age: 25,
    //   },
    // })

    await prisma.user.update({
        where: { id: 1 },
        data: { age: 26 },
    })      
  
    const allUsers = await prisma.todos.user.findMany({
      
    })
    console.dir(allUsers, { depth: null })
  }

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// to Calcualte total subject points 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    const totalSubjectPoints = 
      (user.dsaPoints || 0) + 
      (user.osPoints || 0) + 
      (user.cnPoints || 0) + 
      (user.dbmsPoints || 0) + 
      (user.hrPoints || 0) + 
      (user.oopsPoints || 0) + 
      (user.systemDesignPoints || 0);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { subjectPoints: totalSubjectPoints }
    });
    
    console.log(`Updated user ${user.email}: ${totalSubjectPoints} subject points`);
  }
  
  console.log('All users updated!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
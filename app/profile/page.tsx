import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const user = await requireUser();

  // Fetch additional user data
  const pointTransactions = await prisma.pointTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {pointTransactions.map((txn) => (
            <div key={txn.id} className="p-4 border border-gray-800 rounded-lg">
              <p className="font-semibold">{txn.source}</p>
              <p className="text-sm text-gray-400">
                {txn.points > 0 ? '+' : ''}{txn.points} points
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

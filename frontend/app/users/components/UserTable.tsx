import type { UserOut } from "@/app/utils/schema.ui";

interface UserTableProps {
  users: UserOut[];
  onEdit: (user: UserOut) => void;
  onDelete: (email: string) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="card-fr overflow-hidden border border-bg-alt bg-bg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-bg-alt bg-bg-alt/50 text-text-muted">
              <th className="p-m font-main text-sm font-bold uppercase tracking-wider">Email Utilisateur</th>
              <th className="p-m font-main text-sm font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-alt">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.email} className="group hover:bg-bg-alt/30 transition-colors">
                  <td className="p-m font-code font-bold text-text">
                    {user.email}
                  </td>
                  <td className="p-m text-right">
                    <div className="flex justify-end gap-m">
                      <button
                        onClick={() => onEdit(user)}
                        className="text-xs font-bold text-fr-blue hover:underline cursor-pointer"
                      >
                        MODIFIER
                      </button>
                      <button
                        onClick={() => onDelete(user.email)}
                        className="text-xs font-bold text-error hover:text-fr-red/80 transition-colors cursor-pointer"
                      >
                        SUPPRIMER
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-l text-center text-text-muted italic">Aucun utilisateur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

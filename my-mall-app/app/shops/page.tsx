
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";

export default async function ShopsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return <div>Access denied</div>;
  }

  // тук извикваш магазините
  return <div>Каталог с магазини</div>;
}

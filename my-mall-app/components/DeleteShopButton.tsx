'use client';

type Props = {
  shopId: number;
};

export default function DeleteShopButton({ shopId }: Props) {
  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
  };

  return (
    <form method="POST" action={`/shops/${shopId}/delete`} onSubmit={handleDelete}>
      <button
        type="submit"
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </form>
  );
}

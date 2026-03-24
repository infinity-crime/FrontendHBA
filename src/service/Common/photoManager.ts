import { set, get } from 'idb-keyval';

//Добавления в IndexedDB
export const saveImage = (userId: number, file: File | Blob) => {
  return set(userId, file);
};

//Извлечение в IndexedDB
export const getImage = async (id: number): Promise<Blob | null> => {
  try {
    const file = await get(id);
    return file ?? null;
  } catch (err) {
    console.error('Ошибка получения:', err);
    return null;
  }
};

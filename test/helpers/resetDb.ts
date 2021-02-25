import { MikroORM } from '@mikro-orm/core';

export async function resetDb (orm: MikroORM): Promise<void> {
  const { em } = orm;
  const connection = em.getConnection();
  await connection.execute('DELETE FROM "Session";');
  await connection.execute('DELETE FROM "Verifier";');
  await connection.execute('DELETE FROM "PresentationRequest";');
  await connection.execute('DELETE FROM "Presentation";');
  await connection.execute('DELETE FROM "NoPresentation";');
}

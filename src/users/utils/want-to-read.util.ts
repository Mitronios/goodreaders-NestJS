import type { UpdateQuery } from 'mongoose';
import type { User } from '../schemas/user.schema';

export interface WantToReadUpdatePlan {
  sanitizedBookId: string;
  pullUpdate: UpdateQuery<User>;
  pushUpdate?: UpdateQuery<User>;
}

export function buildWantToReadUpdatePlan(
  bookId: string,
  wantToRead: boolean,
): WantToReadUpdatePlan {
  const sanitizedBookId = bookId.trim();

  const pullUpdate: UpdateQuery<User> = {
    $pull: { books: { bookId: sanitizedBookId } },
  };

  const pushUpdate = wantToRead
    ? ({
        $push: {
          books: { bookId: sanitizedBookId, wantToRead: true },
        },
      } satisfies UpdateQuery<User>)
    : undefined;

  return {
    sanitizedBookId,
    pullUpdate,
    pushUpdate,
  };
}

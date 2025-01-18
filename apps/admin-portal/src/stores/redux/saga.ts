import { all, fork } from 'redux-saga/effects';

import filesWatcher from '@/modules/files/states/files.saga';
import usersWatcher from '@/modules/users/states/users.saga';

export default function* root() {
  yield all([fork(usersWatcher), fork(filesWatcher)]);
}

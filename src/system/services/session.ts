import { store } from "../../store";
import { changeLoggedUserName as changeUserName } from '../state/sessionSlice';

export function changeLoggedUserName(newName: string, password: string) {
    store.dispatch(changeUserName({ newName, password }))
}
import { Pages } from "../@enums/Pages";

export const getHashLocation = () => {
    const hash = window.location.hash.replace('#', '');

    for (let i in Pages) {
        if (Pages[i as keyof typeof Pages] === hash) {
            return Pages[i as keyof typeof Pages];
        }
    }

    return null;
}
import type {Handle} from "@sveltejs/kit";


export const handle: Handle = async ({ event, resolve }) => {


    if(event.platform?.cf?.timezone) {
        event.params.__timezone = event.platform?.cf?.timezone as never;
    }

    return resolve(event);
}

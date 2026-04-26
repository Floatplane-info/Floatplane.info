import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function wait(ms: number) {
	return new Promise((res) => {
		setTimeout(res, Math.floor(ms));
	});
}

export function commas(x: number | undefined | null, decimals?: undefined | number) {
	if(typeof x === "undefined" || x === null) return x;
	const parts = (typeof decimals === "undefined" ? x.toString() : x.toFixed(decimals ?? 100))
		.split(".")
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts.length > 1 ? "." : "") + parts.slice(1).join(".");
}

export function addZero(n: number): string {
	return n > 9 ? "" + n : "0" + n
}

export async function retryD1<T>(run: () => Promise<T>, shouldRetry = shouldRetryD1): Promise<T> {
	let err: unknown | undefined = undefined;
	let attempt = 1;
	do {
		try {
			return await run();
		} catch(e) {
			console.warn("Got error on attempt #" + attempt, e)
			err = e;
			if(attempt >= 2) {
				await wait(500 * (attempt-1));
			}
		}
	} while(shouldRetry(err, ++attempt));

	throw err;
}

export async function retry<T>(run: () => Promise<T>, attempts = 5): Promise<T> {
	return retryD1(run, (err: unknown, nextAttempt: number) => nextAttempt <= attempts)
}

export function shouldRetryD1(err: any, nextAttempt: number) {
	const errMsg = err?.message ?? String(err);
	const isRetryableError =
		errMsg.includes("Network connection lost") ||
		errMsg.includes("storage caused object to be reset") ||
		errMsg.includes("reset because its code was updated") ||
		errMsg.includes("which caused object to be reset") ||
		(errMsg.includes("error code: 500") && errMsg.includes("is not valid JSON")) ||
		errMsg === "D1_ERROR: Failed to parse body as JSON, got: error code: 500" ||
		errMsg.includes("Requests queued for too long") ||
		errMsg.includes("D1_ERROR: internal error;");

	return nextAttempt <= 7 && isRetryableError;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

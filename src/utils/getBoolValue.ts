export function getBoolValue(
    refOrBool: boolean | React.RefObject<boolean> | undefined | null,
): boolean {
    if (!refOrBool) return false;
    if (typeof refOrBool === "object" && "current" in refOrBool) {
        return !!refOrBool.current;
    }

    return refOrBool === true;
}

import { getRole } from "./utils"

export type UserRole = "super_admin" | "procurement" | "client" | "user"

export type User = {
    role: UserRole
}

export function getFeatureRole() {
    const role = getRole();
    // console.log("ROLE :", role)
    return { role: role } as User
}
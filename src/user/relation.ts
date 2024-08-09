

export interface UserMeta {
    [UserMetaRelationKey]: UserMetaRelation
}

/**
 * 用户关系的元数据存储
*/

export const UserMetaRelationKey = `relation`


export interface UserMetaRelation {
    [userId: string]: UserMetaRelationInfo | undefined
}


export function createDefaultRelation(): UserMetaRelationInfo {
    return {
        isFollower: false,
        isFollowing: false
    }
}


// 用户关联信息类型
export type UserMetaRelationInfo = {
    isFollower: boolean // 是否为粉丝
    isFollowing: boolean // 是否为
}

export type Topic = {
    id: number
    user_id: string
    topic_id?: string
    topic_name: string
    created_at?: string
  }

  export type Resource = {
    id: number
    group_id: number | null
    topic_id: number
    link_url: string
    topic: Topic
    email: string
    user_id: string
    description: string
    deleted_at: string | null
    resource_group: Group | undefined
    created_at: string
    updated_at: string
  }
  
  export type Group = {
    id: number
    group_name: string
    user_id: string
    topic_id: number | null
    resource_id: number | null
    created_at: string
    deleted_at: string
    topic: Topic | undefined
    resource: Resource | undefined
  }
  
  export interface ResourceNode {
    node: Resource
  }
  
  export interface TopicNode {
    node: Topic
  }
  export interface GroupNode {
    node: Group
  }
  
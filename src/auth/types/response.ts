export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    city: string;
  }
  
export interface Pagination {
    next?: {
        page: number,
        limit: number
    },
    prev?: {
        page: number,
        limit: number
    }
}

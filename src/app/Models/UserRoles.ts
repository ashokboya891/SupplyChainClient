// src/app/Models/UserRoles.ts

export interface UserRole {
    userId: string;
    userName: string;
    email: string;
    roles: string[];
    selectedRoles?: { [key: string]: boolean }; // ✅ Add this line
  }
  
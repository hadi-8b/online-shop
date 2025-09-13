// src/models/user.ts
export interface UserType {
  id: number;
  first_name?: string;
  last_name?: string;
  phone: string;
  permissions?: string[];
  email?: string | null;
  address?: string;
  profile_picture?: string;
  card_number?: string;
  created_at?: string;
  updated_at?: string;
}

export default class User {
  private userData: UserType | null;

  constructor(user?: UserType | null) {
    this.userData = user || null;
  }

  // Getters
  get data(): UserType | null {
    return this.userData;
  }

  get id(): number | null {
    return this.userData?.id || null;
  }

  get fullName(): string {
    if (!this.userData) return '';
    const { first_name = '', last_name = '' } = this.userData;
    return `${first_name} ${last_name}`.trim() || 'کاربر';
  }

  get firstName(): string {
    return this.userData?.first_name || '';
  }

  get lastName(): string {
    return this.userData?.last_name || '';
  }

  get phone(): string {
    return this.userData?.phone || '';
  }

  get email(): string {
    return this.userData?.email || '';
  }

  get isLoggedIn(): boolean {
    return this.userData !== null && this.userData.id > 0;
  }

  // بررسی دسترسی
  canAccess(permission: string): boolean {
    if (!this.userData?.permissions) return false;
    
    const userPermissions = this.userData.permissions;
    const requiredPermissions = permission
      .split("|")
      .filter(perm => userPermissions.includes(perm));

    return requiredPermissions.length > 0;
  }

  // بررسی دسترسی‌های متعدد (AND)
  hasAllPermissions(permissions: string[]): boolean {
    if (!this.userData?.permissions) return false;
    return permissions.every(perm => this.userData!.permissions!.includes(perm));
  }

  // بررسی دسترسی‌های متعدد (OR)
  hasAnyPermission(permissions: string[]): boolean {
    if (!this.userData?.permissions) return false;
    return permissions.some(perm => this.userData!.permissions!.includes(perm));
  }

  // آپدیت اطلاعات کاربر
  updateData(newData: Partial<UserType>): User {
    if (this.userData) {
      this.userData = { ...this.userData, ...newData };
    }
    return this;
  }
}
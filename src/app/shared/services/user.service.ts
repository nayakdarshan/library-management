import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndexedDbService } from './indexed-db.service';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(
    private indexedDbService: IndexedDbService,
    private commonService: CommonServiceService
  ) {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const users = await this.indexedDbService.getAllUsers();
      this.usersSubject.next(users);
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error loading users: ' + error);
    }
  }

  async addUser(user: any) {
    try {
      await this.indexedDbService.addUser(user);
      this.loadUsers();
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error adding user: ' + error);
    }
  }

  async editUser(user: any): Promise<boolean> {
    try {
      await this.indexedDbService.updateUser(user); 
      this.loadUsers(); 
      return true; 
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error editing user: ' + error);
      return false;
    }
  }
  

  async deleteUser(userId: string) {
    try {
      await this.indexedDbService.deleteUser(userId);
      this.loadUsers();
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error deleting user: ' + error);
    }
  }
  async getUserById(userId: string): Promise<any> {
    const users = await this.indexedDbService.getAllUsers();
    const user = users.find(u => u.id === userId);
    return user || null;
  }
}

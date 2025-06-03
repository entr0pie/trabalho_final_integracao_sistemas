// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  async isAuthenticated(token: string, userId: number): Promise<boolean> {
    try {
      const response = await axios.post('http://localhost:3001/auth/validate', {
        userId,
      }, {
        headers: {
          Authorization: token,
        },
      });

      return response.data?.auth === true;
    } catch (err) {
      return false;
    }
  }

  async getAllUsers(): Promise<{ id: number }[]> {
    try {
        const response = await axios.get('http://localhost:3001/users', {
        headers: {
            Authorization: 'your-admin-token', 
        },
        });
        return response.data;
    } catch (err) {
        return [];
    }
  }
}

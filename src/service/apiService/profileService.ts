
import { apiProfile} from '../api/profileApi.ts';
import { getMockProfile } from '../mockData/mockProfileData.ts';
import type { UpdateProfile,  ProfileResponse} from '../../components/types/Profile.ts';

export const getProfile = async (): Promise<ProfileResponse> => {
  // Return mock data instead of calling API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockProfile());
    }, 500); // Simulate network delay
  });
};

export const getProfileById = async (userId: number): Promise<ProfileResponse> => {
  // Return mock data instead of calling API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockProfile());
    }, 500); // Simulate network delay
  });
};

export const updateProfile = async (request: UpdateProfile): Promise<void> => {
  // Mock response - just simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Profile updated (mock):', request);
      resolve();
    }, 500);
  });
};

export const AddPhotoProfile = async (id: number | undefined, file: FormData): Promise<void> => {
  // Mock response - just simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Photo uploaded (mock) for id:', id);
      resolve();
    }, 500);
  });
};

export const GetPhotoProfile = async (id: number | undefined): Promise<Blob> => {
  // Return a mock blob with a placeholder image
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a simple placeholder image (1x1 pixel transparent PNG)
      const byteCharacters = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      resolve(new Blob([byteArray], { type: 'image/png' }));
    }, 500);
  });
};

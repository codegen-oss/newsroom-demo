import axios from 'axios';
import { fetchArticles, fetchArticleById, createArticle, updateArticle, deleteArticle } from '../../../lib/api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('fetchArticles', () => {
    it('fetches articles successfully', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article 1',
          content: 'Content 1',
          summary: 'Summary 1',
          author: 'Author 1',
          published_at: '2023-10-15T12:00:00Z',
          categories: ['news'],
          access_tier: 'free',
          featured_image: '/image1.jpg',
        },
        {
          id: '2',
          title: 'Test Article 2',
          content: 'Content 2',
          summary: 'Summary 2',
          author: 'Author 2',
          published_at: '2023-10-16T12:00:00Z',
          categories: ['technology'],
          access_tier: 'premium',
          featured_image: '/image2.jpg',
        },
      ];
      
      mockedAxios.get.mockResolvedValueOnce({ data: mockArticles });
      
      const result = await fetchArticles('fake-token');
      
      expect(result).toEqual(mockArticles);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8000/articles/',
        { headers: { Authorization: 'Bearer fake-token' } }
      );
    });
    
    it('handles errors when fetching articles', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      
      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(fetchArticles('fake-token')).rejects.toThrow('Error fetching articles');
      expect(console.error).toHaveBeenCalled();
    });
    
    it('passes query parameters correctly', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });
      
      await fetchArticles('fake-token', { category: 'news', limit: 5 });
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8000/articles/?category=news&limit=5',
        { headers: { Authorization: 'Bearer fake-token' } }
      );
    });
  });
  
  describe('fetchArticleById', () => {
    it('fetches an article by ID successfully', async () => {
      const mockArticle = {
        id: '1',
        title: 'Test Article',
        content: 'Content',
        summary: 'Summary',
        author: 'Author',
        published_at: '2023-10-15T12:00:00Z',
        categories: ['news'],
        access_tier: 'free',
        featured_image: '/image.jpg',
      };
      
      mockedAxios.get.mockResolvedValueOnce({ data: mockArticle });
      
      const result = await fetchArticleById('1', 'fake-token');
      
      expect(result).toEqual(mockArticle);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8000/articles/1',
        { headers: { Authorization: 'Bearer fake-token' } }
      );
    });
    
    it('handles errors when fetching an article by ID', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));
      
      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(fetchArticleById('999', 'fake-token')).rejects.toThrow('Error fetching article');
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('createArticle', () => {
    it('creates an article successfully', async () => {
      const newArticle = {
        title: 'New Article',
        content: 'New Content',
        summary: 'New Summary',
        author: 'New Author',
        categories: ['news'],
        access_tier: 'free',
        featured_image: '/new-image.jpg',
      };
      
      const createdArticle = {
        ...newArticle,
        id: '3',
        published_at: '2023-10-17T12:00:00Z',
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: createdArticle });
      
      const result = await createArticle(newArticle, 'fake-token');
      
      expect(result).toEqual(createdArticle);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/articles/',
        newArticle,
        { headers: { Authorization: 'Bearer fake-token' } }
      );
    });
    
    it('handles errors when creating an article', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Validation error'));
      
      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(createArticle({} as any, 'fake-token')).rejects.toThrow('Error creating article');
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('updateArticle', () => {
    it('updates an article successfully', async () => {
      const articleUpdate = {
        title: 'Updated Title',
        summary: 'Updated Summary',
      };
      
      const updatedArticle = {
        id: '1',
        title: 'Updated Title',
        content: 'Original Content',
        summary: 'Updated Summary',
        author: 'Original Author',
        published_at: '2023-10-15T12:00:00Z',
        categories: ['news'],
        access_tier: 'free',
        featured_image: '/image.jpg',
      };
      
      mockedAxios.put.mockResolvedValueOnce({ data: updatedArticle });
      
      const result = await updateArticle('1', articleUpdate, 'fake-token');
      
      expect(result).toEqual(updatedArticle);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'http://localhost:8000/articles/1',
        articleUpdate,
        { headers: { Authorization: 'Bearer fake-token' } }
      );
    });
    
    it('handles errors when updating an article', async () => {
      mockedAxios.put.mockRejectedValueOnce(new Error('Not found'));
      
      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(updateArticle('999', {}, 'fake-token')).rejects.toThrow('Error updating article');
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('deleteArticle', () => {
    it('deletes an article successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: { message: 'Article deleted successfully' } });
      
      await deleteArticle('1', 'fake-token');
      
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        'http://localhost:8000/articles/1',
        { headers: { Authorization: 'Bearer fake-token' } }
      );
    });
    
    it('handles errors when deleting an article', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Not found'));
      
      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(deleteArticle('999', 'fake-token')).rejects.toThrow('Error deleting article');
      expect(console.error).toHaveBeenCalled();
    });
  });
});


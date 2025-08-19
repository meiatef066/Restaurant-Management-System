const { getProfile, updateProfile } = require('../../controllers/profile.controller');
const User = require('../../models/User');

// Mock the User model ---- npx jest tests/unit/profile.test.js
jest.mock('../../models/User');

describe('Profile Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: '123' },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // -------------------- GET PROFILE --------------------
  describe('getProfile()', () => {
    it('should return user data without password', async () => {
      const mockUser = {
        select: jest.fn().mockResolvedValue({
          _id: '123',
          firstName: 'John',
          email: 'john@example.com',
        }),
      };

      User.findById.mockReturnValue(mockUser);

      await getProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(mockUser.select).toHaveBeenCalledWith('-password');
      expect(res.json).toHaveBeenCalledWith({
        _id: '123',
        firstName: 'John',
        email: 'john@example.com',
      });
    });

    it('should return 404 if user not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  // -------------------- UPDATE PROFILE --------------------
  describe('updateProfile()', () => {
    it('should update only allowed fields and ignore unknown ones', async () => {
      const mockUser = {
        firstName: 'Old',
        secondName: 'Old',
        email: 'old@example.com',
        role: 'user',
        gender: 'male',
        mobileNumber: '0000000000',
        save: jest.fn().mockResolvedValue({
          firstName: 'New',
          secondName: 'New',
          email: 'new@example.com',
          role: 'admin',
          gender: 'female',
          mobileNumber: '1234567890',
        }),
      };

      req.body = {
        firstName: 'New',
        secondName: 'New',
        email: 'new@example.com',
        role: 'admin',
        gender: 'female',
        mobileNumber: '1234567890',
        notAllowedField: 'ignore me',
      };

      User.findById.mockResolvedValue(mockUser);

      await updateProfile(req, res);

      expect(mockUser).toMatchObject({
        firstName: 'New',
        SecondName: 'New',
        email: 'new@example.com',
        role: 'admin',
        gender: 'female',
        mobileNumber: '1234567890',
      });

      expect(mockUser.notAllowedField).toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        user: await mockUser.save(),
      });
    });
  });
});


/**
 * Matcher
toBe(value)	تطابق القيمة البسيطة (primitive)
toEqual(obj)	تطابق الكائنات أو المصفوفات
toBeUndefined()	يتأكد أن القيمة غير معرفة
toHaveBeenCalledWith(args)	يتأكد أن دالة تم استدعاؤها بقيم معينة
toHaveBeenCalled()	يتأكد أن الدالة تم استدعاؤها
 */
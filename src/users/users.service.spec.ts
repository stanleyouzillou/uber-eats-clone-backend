import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(() => 'mocked signed token'),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let usersRespository: MockRepository<User>;
  let verificationsRepository: MockRepository<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
    usersRespository = module.get(getRepositoryToken(User));
    verificationsRepository = module.get(getRepositoryToken(Verification));
  });

  it('be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'testuser@gmail.com',
      password: '',
      role: 0,
    };

    it('should fail if user exist', async () => {
      usersRespository.findOne.mockResolvedValue(createAccountArgs);
      const result = await service.createAccount({
        email: 'testuser@gmail.com',
        password: '',
        role: 0,
      });
      expect(result).toMatchObject({
        ok: false,
        error:
          'Your account with the following email address testuser@gmail.com already exists',
      });
    });
    it('should create a new user', async () => {
      usersRespository.findOne.mockResolvedValue(undefined);
      usersRespository.create.mockResolvedValue(createAccountArgs);
      usersRespository.save.mockResolvedValue(createAccountArgs);
      verificationsRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      verificationsRepository.save.mockResolvedValue({
        code: 'code',
      });
      const result = await service.createAccount(createAccountArgs);

      expect(usersRespository.create).toHaveBeenCalledTimes(1);
      expect(usersRespository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(usersRespository.save).toHaveBeenCalledTimes(1);
      expect(usersRespository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(verificationsRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);

      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual({ ok: true, error: null });
    });

    it('should fail on exception', async () => {
      usersRespository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({ ok: false, error: 'account creation failed' });
    });
  });
  describe('login', () => {
    const loginArgs = {
      email: 'testuser@gmail.com',
      password: 'testpassword',
    };
    it("should fail if user doesn't exist", async () => {
      usersRespository.findOne.mockResolvedValue(null);
    });
    it('should fail if password is wrong', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRespository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error:
          'Hey User with email: testuser@gmail.com, your password is not correct',
      });
    });

    it('should return token if password is correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRespository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      console.log(result);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({
        error: null,
        ok: true,
        token: 'mocked signed token',
      });
    });
  });
  it.todo('findOne');
  it.todo('editProfile');
  it.todo('verifyEmail');
});

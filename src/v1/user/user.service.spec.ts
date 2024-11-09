import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma';

// สร้าง Mock สำหรับ PrismaService
const mockPrismaService = {
  users: {
    findMany: jest.fn()
  }
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // เคลียร์ค่า mock หลังแต่ละการทดสอบ
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllName', () => {
    it('should return array of user names when successful', async () => {
      // Arrange

      interface IUser {
        name: string
      }

      const mockUsers = [
        { namef: 'John' },
        { namef: 'Jane' }
      ];
      mockPrismaService.users.findMany.mockResolvedValue(mockUsers);

      // Act
      const result: IUser[] = await service.getAllName();
      console.log("result111 : ", result)
      // Assert
      expect<IUser[]>(result).toEqual<IUser[]>(mockUsers);
      expect(prisma.users.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.users.findMany).toHaveBeenCalledWith({
        select: {
          name: true
        }
      });
    });

    it('should return null when database error occurs', async () => {
      // Arrange
      mockPrismaService.users.findMany.mockRejectedValue(new Error('DB Error'));

      // Act
      const result = await service.getAllName();

      // Assert
      expect(result).toBeNull();
      expect(prisma.users.findMany).toHaveBeenCalledTimes(1);

      // เพิ่ม spy สำหรับ console.log ถ้าต้องการทดสอบ error logging
      // const consoleSpy = jest.spyOn(console, 'log');
      // expect(consoleSpy).toHaveBeenCalledWith('error at find user from database');
    });
  });
});








// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';
// import { PrismaService } from 'src/database/prisma';
// import { createMockPrismaService, MockPrismaService } from 'src/database/prisma.mock'

// const userArray = [
//   {
//     id: 1,
//     name: "test name",
//     email: "isExited@mail.com",
//     hwid: null,
//     credit: 0,
//     role: 1,
//     email_verified_at: null,
//     password: "test pain password",
//     remember_token: null,
//     created_at: null,
//     updated_at: null,
//     isActive: true,
//     createdAt: new Date("2024-09-20T13:40:09.292Z"),
//     updatedAt: new Date("2024-09-20T13:40:09.292Z")
//   },
//   {
//     id: 2,
//     name: "test2",
//     email: "test2@mail.com",
//     hwid: null,
//     credit: 0,
//     role: 1,
//     email_verified_at: null,
//     password: "test pain password",
//     remember_token: null,
//     created_at: null,
//     updated_at: null,
//     isActive: true,
//     createdAt: new Date("2024-09-20T13:40:09.292Z"),
//     updatedAt: new Date("2024-09-20T13:40:09.292Z")
//   },
//   {
//     id: 3,
//     name: "test3",
//     email: "test3@mail.com",
//     hwid: null,
//     credit: 0,
//     role: 1,
//     email_verified_at: null,
//     password: "test pain password",
//     remember_token: null,
//     created_at: null,
//     updated_at: null,
//     isActive: true,
//     createdAt: new Date("2024-09-20T13:40:09.292Z"),
//     updatedAt: new Date("2024-09-20T13:40:09.292Z")
//   }
// ]

// const userOne = userArray[0]



// describe('UserService', () => {
//   let userService: UserService;
//   let prismaService: MockPrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: PrismaService,
//           useValue: createMockPrismaService()
//         },
//       ],
//     }).compile();

//     userService = module.get<UserService>(UserService);
//     prismaService = module.get(PrismaService);
//   });

//   it('should be defined', () => {
//     expect(userService).toBeDefined();
//   });



//   // it('it should found user', async () => {

//   //   const mockUser = {
//   //     id: 1,
//   //     name: "test name",
//   //     email: "isExited@mail.com",
//   //     hwid: null,
//   //     credit: 0,
//   //     role: 1,
//   //     email_verified_at: null,
//   //     password: "test pain password",
//   //     remember_token: null,
//   //     created_at: null,
//   //     updated_at: null,
//   //     isActive: true,
//   //     createdAt: new Date("2024-09-20T13:40:09.292Z"),
//   //     updatedAt: new Date("2024-09-20T13:40:09.292Z")
//   //   }

//   //   const testEmail = "isExited@mail.com"

//   //   prismaService.users.findUnique.mockResolvedValue(mockUser);

//   //   const result = await userService.findUserByEmail(testEmail);
//   //   expect(result).toEqual(mockUser);

//   // });


//   // it('it should return all user', async () => {

//   //   const users = await userService.clientFindAll()

//   //   expect(users).toEqual(userArray);
//   // })


//   it('it should return all name of user', async () => {
//     const expectResult = [{ name: "user1" }, { name: "user2" }];
//     prismaService.users.findMany.mockResolvedValue(userArray);

//     const result = await userService.getAllName()


//     expect(result).toEqual(expectResult)
//     expect(prismaService.users.findMany).toHaveBeenCalledWith({
//       select: {
//         name: true
//       }
//     });
//   })

// });


// // import { Test, TestingModule } from '@nestjs/testing';
// // import { UserService } from './user.service';

// // describe('UserService', () => {
// //   let service: UserService;

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       providers: [UserService],
// //     }).compile();

// //     service = module.get<UserService>(UserService);
// //   });

// //   it('should be defined', () => {
// //     expect(service).toBeDefined();
// //   });
// // });




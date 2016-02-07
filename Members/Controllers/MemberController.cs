using Antlr.Runtime.Misc;
using LG.Clinical;
using LG.Clinical.com.rxnt.stage;
using LG.Data.Members;
using LG.Data.Models;
using LG.Data.Models.Clinical;
using LG.Data.Models.Core;
using LG.Data.Models.Doctors.ConsultWizard;
using LG.Data.Models.Enums;
using LG.Data.Models.Members;
using LG.Data.Models.Orders;
using LG.Data.Models.Shared;
using LG.Data.Orders;
using LG.Data.Users;
using LG.Owin.Identity;
using LG.Owin.Identity.Core;
using LG.Owin.Identity.Models;
using LG.Services;
using LG.Services.ACS;
using LG.Services.CDMS;
using LG.Services.EMS;
using LG.Services.OMS;
using Members.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Members.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/DataService")]
    public class MembersController : ApiController
    {
        protected static AppContextUser UserContext
        {
            get
            {
                return AppContextUser.GetCurrentSingleton();
            }
        }

        public MembersController()
        {
        }

        protected async Task<LG.Data.Models.Members.Entity> CreateAccount(LG.Data.Models.Members.Entity entity)
        {
            return await AccountService.Create(entity);
        }

        protected async Task<LG.Data.Models.Members.Entity> CreateEntity(LG.Data.Models.Members.Entity entity)
        {
            return await SharedService.CreateEntity(entity);
        }

        [HttpGet]
        [Route("find/Consults/ByAccountID/{Id}")]
        public async Task<OrderInProcess> FindConsultsByAccountID(int Id)
        {
            OrderInProcess orderInProcess = new OrderInProcess()
            {
                AccountID = Id,
                ProcessState = ProcessStateEnum.Completed,
                OrderAction = OrderAction.FindConsultationsInProcessState
            };
            return await (new OrderDetails()).FindItemsInProcess(orderInProcess);
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("load/Messages/{Id}")]
        public async Task<MessageConsultation> GetAllMessagesByConsultID(int Id)
        {
            return await MembersController.UserContext.GetAllMessagesByConsultID(Id);
        }

        [EnableCors("*", "*", "*")]
        [HttpPost]
        [Route("send/Message")]
        public async Task<MessageConsultation> SendMessage(Members.Models.MessageEntity entity)
        {
            return await MembersController.UserContext.SendMessage(entity.Message);
        }


        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("load/CallList/{Id}")]
        public async Task<AudioCallList> GetCallListByConsultID(int Id)
        {
            return await MembersController.UserContext.LoadConsultCallHistroy(Id);
        }

        [HttpGet]
        [Route("get/Account/CC")]
        public async Task<List<CreditCardInfo>> GetCreditCard()
        {
            return await MembersController.UserContext.GetCreditCards();
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("get/HealthRecords")]
        public async Task<MedicalRecords> GetHealthRecords()
        {
            MedicalRecords healthRecords;
            if (!await MembersController.UserContext.LoadConsultHealthRecords())
            {
                healthRecords = null;
            }
            else
            {
                MedicalRecords vitalsRecords = MembersController.UserContext.HealthRecords;
                vitalsRecords.Vitals = await this.GetVitalsRecords();
                vitalsRecords = null;
                healthRecords = MembersController.UserContext.HealthRecords;
            }
            return healthRecords;
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("load/DependentObject")]
        public LG.Data.Models.Members.Entity GetObject()
        {
            return new LG.Data.Models.Members.Entity()
            {
                AccountInfo = new AccountInfo(),
                PersonInfo = new LG.Services.EMS.PersonInfo()
                {
                    FName = "dependent",
                    LName = "lastname"
                },
                Phones = new List<Phone>()
                {
                    new Phone()
                    {
                        PhoneNumber = "3057767366",
                        PhoneUsages = new ListStack<PhoneUsage>()
                        {
                            new PhoneUsage()
                            {
                                IsPrimary = true,
                                PhoneUsageEnum = PhoneUsageEnum.Mobile
                            }
                        }
                    }
                },
                EmailAddresses = new List<LG.Services.EMS.EmailAddress>()
                {
                    new LG.Services.EMS.EmailAddress()
                    {
                        Email = "test@test.com",
                        EmailAddressUsages = new List<EmailAddressUsage>()
                        {
                            new EmailAddressUsage()
                            {
                                IsPrimary = true,
                                EmailAddressUsageEnum = EmailAddressUsageEnum.Personal
                            }
                        }
                    }
                },
                Events = new Events()
                {
                    EventAction = LG.Data.Models.Enums.Action.Add,
                    AccountAction = AccountAction.AccountInfo
                }
            };
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("get/Vitals")]
        public async Task<List<LG.Services.CDMS.VitalReading>> GetVitalsRecords()
        {
            var cDMSConnection = ClientConnection.GetCDMS_Connection();
            var clinicalDataManagementServiceClient = cDMSConnection;
            var getVitalReadingsRequest = new GetVitalReadingsRequest()
            {
                RID = MembersController.UserContext.RolodexItemID,
                MessageGuid = Guid.NewGuid(),
                VitalStatistics = VitalStatisticsEnum.Weight
            };
            var vitalReadingsAsync = await clinicalDataManagementServiceClient.GetVitalReadingsAsync(getVitalReadingsRequest);
            var clinicalDataManagementServiceClient1 = cDMSConnection;
            var getVitalReadingsRequest1 = new GetVitalReadingsRequest()
            {
                RID = MembersController.UserContext.RolodexItemID,
                MessageGuid = Guid.NewGuid(),
                VitalStatistics = VitalStatisticsEnum.Height
            };
            var getVitalReadingsResponse = await clinicalDataManagementServiceClient1.GetVitalReadingsAsync(getVitalReadingsRequest1);
            var vitalReadings = new List<LG.Services.CDMS.VitalReading>();
            vitalReadings.AddRange(vitalReadingsAsync.VitalReadings);
            vitalReadings.AddRange(getVitalReadingsResponse.VitalReadings);
            return vitalReadings;
        }

        internal static async Task<bool> GetWaiter()
        {
            await Task.Delay(1);
            return true;
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("get/IsAuthenticated")]
        public bool IsAuthenticated()
        {
            return MembersController.UserContext.IsAuthenticated;
        }

        [HttpGet]
        [Route("load/Consult/{Id}")]
        public async Task<ConsultationHistoryItem> LoadConsult(int Id)
        {
            return await MembersController.UserContext.LoadConsult(Id);
        }

        [HttpGet]
        [Route("load/ConsultsHistory")]
        public async Task<OrderInProcess> LoadConsults()
        {
            OrderInProcess orderInProcess = new OrderInProcess()
            {
                AccountID = MembersController.UserContext.AccountInfo.AccountInfo.AccountID,
                ProcessState = ProcessStateEnum.Completed,
                OrderAction = OrderAction.FindConsultationsInProcessState
            };
            return await Orders.FindItemsInProcess(orderInProcess);
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("load/Dependents/{Id}")]
        public async Task<List<AccountInfoExtended>> loadDependents(long Id)
        {
            List<AccountInfoExtended> accountInfoExtendeds;
            if (MembersController.UserContext.IsAuthenticated)
            {
                accountInfoExtendeds = await MembersController.UserContext.LoadDependents();
            }
            else
            {
                await this.loadMember(Id);
                accountInfoExtendeds = await MembersController.UserContext.LoadDependents();
            }
            return accountInfoExtendeds;
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("load/Identity")]
        public async Task<IdentityUser> loadIdentityUser()
        {
            await MembersController.GetWaiter();
            IdentityUser identityUser = new IdentityUser()
            {
                AccessToken = "",
                ExpirationDate = DateTime.Now,
                IsAccountManager = true,
                IsPrimaryMember = true,
                Name = "Manny Ferrario",
                RID = (long)101480,
                TokenID = "43534534534"
            };
            return identityUser;
        }

        [HttpGet]
        [Route("load/Info")]
        public Account LoadInfo()
        {
            return MembersController.UserContext.AccountInfo;
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("get/Member/")]
        public async Task<AppContextUser> loadMember()
        {
            AppContextUser userContext;
            if (!MembersController.UserContext.IsAuthenticated)
            {
                userContext = null;
            }
            else if (!await MembersController.UserContext.Load())
            {
                userContext = null;
            }
            else
            {
                userContext = MembersController.UserContext;
            }
            return userContext;
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("load/Member/{Id}")]
        public async Task<AppContextUser> loadMember(long id)
        {
            AppContextUser userContext;
            if (MembersController.UserContext.IsAuthenticated)
            {
                userContext = null;
            }
            else if (!await MembersController.UserContext.Load(id))
            {
                userContext = null;
            }
            else
            {
                userContext = MembersController.UserContext;
            }
            return userContext;
        }

        [HttpGet]
        [Route("load/OrderList")]
        public async Task<List<OrderInProcess>> LoadOrderList()
        {
           return await UserContext.LoadConsultHistory();
        }

        [EnableCors("*", "*", "*")]
        [HttpPost]
        [Route("save/Account/Address")]
        public async Task<BaseModel> SaveAddress(MemberInstance input)
        {
            return await SaveService.Address(input);
        }

        [HttpPost]
        [Route("save/Account/CreditCard")]
        public async Task<BaseModel> SaveCreditCardInfo(CreditCardInfo_Input input)
        {
            return await SaveService.CreditCard(input);
        }

        [HttpPost]
        [Route("save/Account/dependent")]
        public async Task<LG.Data.Models.Members.Entity> SaveDependentInfo(LG.Data.Models.Members.Entity entity)
        {
            LG.Data.Models.Members.Entity result;
            if (!entity.AccountInfo.IsSelfManaged)
            {
                Task<LG.Data.Models.Members.Entity> task = this.CreateEntity(entity);
                await task;
                if (task.IsCompleted)
                {
                    entity.RID = task.Result.RID;
                    AccountInfo_Input accountInfoInput = new AccountInfo_Input()
                    {
                        RID = entity.RID,
                        IsActive = true,
                        IsAutorenewal = true,
                        MembershipPlanID = entity.MembershipPlanID,
                        IsTesting = entity.AccountInfo.IsTesting,
                        IsSelfManaged = entity.AccountInfo.IsSelfManaged,
                        DTUTC_Activated = DateTime.UtcNow
                    };
                    DateTime utcNow = DateTime.UtcNow;
                    accountInfoInput.DTUTC_Expires = new DateTime?(utcNow.AddMonths(1));
                    accountInfoInput.PrimaryAccountID = entity.AccountInfo.PrimaryAccountID;
                    entity.AccountInfoInput = accountInfoInput;
                    Task<LG.Data.Models.Members.Entity> task1 = this.CreateAccount(entity);
                    await task1;
                    if (task1.IsCompleted)
                    {
                        Task<LG.Data.Models.Members.Entity> task2 = SharedService.Phone(entity);
                        Task<LG.Data.Models.Members.Entity> task3 = SharedService.PersonInfo(entity);
                        await task2;
                        await task3;
                        if (!task2.IsCompleted || !task3.IsCompleted)
                        {
                            task2 = null;
                            task3 = null;
                        }
                        else
                        {
                            result = task1.Result;
                            return result;
                        }
                    }
                    task1 = null;
                }
                result = null;
            }
            else
            {
                result = await this.SaveSelfManagedDependent(entity);
            }
            return result;
        }

        [HttpPost]
        [Route("save/Account/GeneralInfo")]
        public async Task<BaseModel> SaveGeneralInfo(MemberInstance input)
        {
            return await SaveService.PersonInfo(input);
        }

        [HttpPost]
        [Route("save/Account/Phone")]
        public async Task<BaseModel> SavePhone(MemberInstance input)
        {
            return await SaveService.Phone(input);
        }

        protected async Task<LG.Data.Models.Members.Entity> SaveSelfManagedDependent(LG.Data.Models.Members.Entity entity)
        {
            LG.Data.Models.Members.Entity result;
            Task<LG.Data.Models.Members.Entity> task = this.CreateEntity(entity);
            await task;
            if (task.IsCompleted)
            {
                entity.RID = task.Result.RID;
                AccountInfo_Input accountInfoInput = new AccountInfo_Input()
                {
                    RID = entity.RID,
                    IsActive = true,
                    IsAutorenewal = true,
                    MembershipPlanID = entity.MembershipPlanID,
                    IsTesting = entity.AccountInfo.IsTesting,
                    IsSelfManaged = entity.AccountInfo.IsSelfManaged,
                    DTUTC_Activated = DateTime.UtcNow
                };
                DateTime utcNow = DateTime.UtcNow;
                accountInfoInput.DTUTC_Expires = new DateTime?(utcNow.AddMonths(1));
                accountInfoInput.PrimaryAccountID = entity.AccountInfo.PrimaryAccountID;
                entity.AccountInfoInput = accountInfoInput;
                Task<LG.Data.Models.Members.Entity> task1 = this.CreateAccount(entity);
                await task1;
                if (task1.IsCompleted)
                {
                    Task<LG.Data.Models.Members.Entity> task2 = SharedService.Phone(entity);
                    Task<LG.Data.Models.Members.Entity> task3 = SharedService.Email(entity);
                    Task<LG.Data.Models.Members.Entity> task4 = SharedService.PersonInfo(entity);
                    Task<LG.Data.Models.Members.Entity> task5 = SharedService.SecurityInfo(entity);
                    await task2;
                    await task3;
                    await task5;
                    await task4;
                    if (!task5.IsCompleted || !task2.IsCompleted || !task4.IsCompleted || !task3.IsCompleted)
                    {
                        task2 = null;
                        task3 = null;
                        task4 = null;
                        task5 = null;
                    }
                    else
                    {
                        result = task1.Result;
                        return result;
                    }
                }
                task1 = null;
            }
            result = null;
            return result;
        }

        [EnableCors("*", "*", "*")]
        [HttpGet]
        [Route("search/Pharmacies/{value}")]
        public List<RxntPharmacy> searchPharmacies(string value)
        {
            return (new RxService()).SearchPharmacies(value);
        }

        [EnableCors("*", "*", "*")]
        [HttpPost]
        [Route("save/StartOrder")]
        public async Task<Order> startOrder(Order entity)
        {
            Order order = new Order();
            SingleConsultationOrderInput orderInput = entity.OrderInput;
            order.OrderInput = new SingleConsultationOrderInput()
            {
                ChiefComplaint = entity.OrderInput.ChiefComplaint
            };
            return await MembersController.UserContext.ProcessOrder(entity);
        }

        [EnableCors("*", "*", "*")]
        [HttpPost]
        [Route("validate/Email")]
        public ValidEmail Validate(EmailEntity value)
        {
            return UserService.VerifyEmail(value.Email);
        }
    }
}
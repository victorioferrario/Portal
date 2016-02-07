using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using LG.Data.Models.Clinical;
using LG.Data.Models.Enums;
using LG.Services.CDMS;

namespace Members.Controllers.Clinical
{
    [EnableCors(
      origins: "*",
      headers: "*",
      methods: "*"),
      RoutePrefix("api/clinical")]
    public class ClinicalController : ApiController
    {

        #region [   Model   ]


        [HttpGet]
        [Route("get/Data")]
        public LG.Data.Models.Clinical.Data Get()
        {

            var familyCondition = new LG.Data.Models.Clinical.FamilyCondition()
            {
                InsertInput = new FamilyHistoryRecord_Insert()
                {

                },
                UpdateInput = new FamilyHistoryRecord_Update(),
                FamilyHistoryRecordItem = new LG.Services.CDMS.FamilyHistoryRecord()
                {

                }
            };
            var medicationTaken = new LG.Data.Models.Clinical.MedicationTaken
            {
                InsertInput = new MedicationTaken_Insert()
                {

                },
                UpdateInput = new MedicationTaken_Update(),
                MedicationTakenItem = new LG.Services.CDMS.MedicationTaken()
                {

                }
            };
            return new LG.Data.Models.Clinical.Data()
            {

                FamilyConditionEntitiy = familyCondition,
                MedicationTakenEntitiy = medicationTaken
            };
        }
        #endregion


        [HttpGet]
        [Route("auto/Allergies/{value}")]
        public async Task<LG.Data.Models.Clinical.AllergyResults> AutoAllergies(
           string value)
        {
            LG.Data.Models.Clinical.AllergyResults entity = new AllergyResults()
            {
                SearchText = value,
                ResultSetSize = 100
            };
            return await LG.Data.Clinical.ClinicalServices.Allergies(entity);
        }

        [HttpGet]
        [Route("auto/Conditions/{value}")]
        public async Task<LG.Data.Models.Clinical.ConditionsResults> AutoConditions(
        string value)
        {
            var entity = new ConditionsResults()
            {
                SearchText = value,
                ResultSetSize = 100
            };
            return await LG.Data.Clinical.ClinicalServices.Conditions(entity);
        }
        [HttpGet]
        [Route("auto/Medications/{value}")]
        public async Task<LG.Data.Models.Clinical.MedicationResults> AutoMedications(string value)
        {
            var entity = new MedicationResults()
            {
                SearchText = value,
                ResultSetSize = 100
            };
            return await LG.Data.Clinical.ClinicalServices.Medications(entity);
        }

        #region [   Allergies    ]

        [HttpPost]
        [Route("find/Allergies")]
        public async Task<LG.Data.Models.Clinical.AllergyResults> FindAllergies(LG.Data.Models.Clinical.AllergyResults entity)
        {
            return await LG.Data.Clinical.ClinicalServices.Allergies(entity);
        }

       

        [HttpPost]
        [Route("insert/Allergy")]
        public async Task<LG.Data.Models.Clinical.Allergy> InsertAllergy(LG.Data.Models.Clinical.Allergy entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = LG.Data.Models.Enums.ClinicalAction.Add,
                ClincalActionType = ClinicalType.Allergy
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.Allergy(entity);
        }

        [HttpPost]
        [Route("update/Allergy")]
        public async Task<LG.Data.Models.Clinical.Allergy> UpdateAllergy(LG.Data.Models.Clinical.Allergy entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = LG.Data.Models.Enums.ClinicalAction.Update,
                ClincalActionType = ClinicalType.Allergy
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.Allergy(entity);
        }

        [HttpPost]
        [Route("load/Allergies")]
        public async Task<LG.Data.Models.Clinical.Allergy> GetAllergies(LG.Data.Models.Clinical.Allergy entity)
        {
            return await LG.Data.Clinical.ClinicalServices.LoadAllergies(entity);
        }

        #endregion

        #region [   Conditions   ]

        [HttpPost]
        [Route("insert/Condition")]
        public async Task<LG.Data.Models.Clinical.Condition> InsertCondition(LG.Data.Models.Clinical.Condition entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.Add,
                ClincalActionType = ClinicalType.Condition
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.Condition(entity);
        }

        [HttpPost]
        [Route("update/Condition")]
        public async Task<LG.Data.Models.Clinical.Condition> UpdateCondition(LG.Data.Models.Clinical.Condition entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.Update,
                ClincalActionType = ClinicalType.Condition
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.Condition(entity);
        }

        [HttpPost]
        [Route("load/Conditions")]
        public async Task<LG.Data.Models.Clinical.Condition> LoadConditions(LG.Data.Models.Clinical.Condition entity)
        {
            return await LG.Data.Clinical.ClinicalServices.LoadConditions(entity);
        }

        [HttpPost]
        [Route("find/Conditions")]
        public async Task<LG.Data.Models.Clinical.ConditionsResults> FindConditions(
            LG.Data.Models.Clinical.ConditionsResults entity)
        {
            return await LG.Data.Clinical.ClinicalServices.Conditions(entity);
        }

     
        #endregion

        #region [   Medications   ]
        [HttpPost]
        [Route("find/Medications")]
        public async Task<LG.Data.Models.Clinical.MedicationResults> FindMedications(
            LG.Data.Models.Clinical.MedicationResults entity)
        {
            return await LG.Data.Clinical.ClinicalServices.Medications(entity);
        }

   

        [HttpPost]
        [Route("insert/MedicationTaken")]
        public async Task<LG.Data.Models.Clinical.MedicationTaken> InsertMedicationTaken(LG.Data.Models.Clinical.MedicationTaken entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.Add,
                ClincalActionType = ClinicalType.Medication
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.Medication(entity);
        }
        [HttpPost]
        [Route("update/MedicationTaken")]
        public async Task<LG.Data.Models.Clinical.MedicationTaken> UpdateMedicationTaken(LG.Data.Models.Clinical.MedicationTaken entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.Update,
                ClincalActionType = ClinicalType.Medication
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.Medication(entity);
        }
        [HttpPost]
        [Route("load/MedicationTaken")]
        public async Task<LG.Data.Models.Clinical.MedicationTaken> LoadMedicationTaken(LG.Data.Models.Clinical.MedicationTaken entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.LoadAll,
                ClincalActionType = ClinicalType.Medication
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.Medication(entity);
        }

        #endregion

        #region [   FamilyHistory   ]
        [HttpPost]
        [Route("load/FamilyHistory")]
        public async Task<LG.Data.Models.Clinical.FamilyCondition> LoadFamilyHistory(
            LG.Data.Models.Clinical.FamilyCondition entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.LoadAll,
                ClincalActionType = ClinicalType.FamilyHistory
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.LoadFamilyHistory(entity);
        }
        [HttpPost]
        [Route("insert/FamilyHistory")]
        public async Task<LG.Data.Models.Clinical.FamilyCondition> InsertFamilyHistory(LG.Data.Models.Clinical.FamilyCondition entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.Add,
                ClincalActionType = ClinicalType.FamilyHistory
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.FamilyHistory(entity);
        }
        [HttpPost]
        [Route("update/FamilyCondition")]
        public async Task<LG.Data.Models.Clinical.FamilyCondition> UpdateFamilyHistory(LG.Data.Models.Clinical.FamilyCondition entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.Update,
                ClincalActionType = ClinicalType.FamilyHistory
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.FamilyHistory(entity);
        }
        #endregion

        #region [   VitalReadings   ]
        [HttpPost]
        [Route("load/VitalReadings")]
        public async Task<LG.Data.Models.Clinical.VitalReading> LoadVitalReadingsTask(
            LG.Data.Models.Clinical.VitalReading entity)
        {

            var temp = LoadVitalReadingsHeight(entity);
            await temp;
            if (!temp.IsCompleted) return null;
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.LoadWeight,
                ClincalActionType = ClinicalType.VitalReading
            };
            var newEntity = temp.Result;
            newEntity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.VitalReading(newEntity);
        }
        public async Task<LG.Data.Models.Clinical.VitalReading> LoadVitalReadingsHeight(
            LG.Data.Models.Clinical.VitalReading entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.LoadHeight,
                ClincalActionType = ClinicalType.VitalReading
            };
            entity.ActionHelper = action;

            return await LG.Data.Clinical.ClinicalServices.VitalReading(entity);
        }
        [HttpPost]
        [Route("insert/VitalReading/Height")]
        public async Task<LG.Data.Models.Clinical.VitalReading> InsertVitalReadingHeight(LG.Data.Models.Clinical.VitalReading entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.AddHeight,
                ClincalActionType = ClinicalType.VitalReading
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.VitalReading(entity);
        }

        [HttpPost]
        [Route("update/VitalReading/Height")]
        public async Task<LG.Data.Models.Clinical.VitalReading> UpdateVitalReadingHeight(LG.Data.Models.Clinical.VitalReading entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.UpdateHeight,
                ClincalActionType = ClinicalType.VitalReading
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.VitalReading(entity);
        }
        [HttpPost]
        [Route("insert/VitalReading/Weight")]
        public async Task<LG.Data.Models.Clinical.VitalReading> InsertVitalReadingWeight(LG.Data.Models.Clinical.VitalReading entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.AddWeight,
                ClincalActionType = ClinicalType.VitalReading
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.VitalReading(entity);
        }

        [HttpPost]
        [Route("update/VitalReading/Weight")]
        public async Task<LG.Data.Models.Clinical.VitalReading> UpdateVitalReadingWeight(LG.Data.Models.Clinical.VitalReading entity)
        {
            var action = new ActionHelper()
            {
                ClincalAction = ClinicalAction.UpdateWeight,
                ClincalActionType = ClinicalType.VitalReading
            };
            entity.ActionHelper = action;
            return await LG.Data.Clinical.ClinicalServices.VitalReading(entity);
        }

        #endregion



    }
}

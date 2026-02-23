from backend.orchestrator import Orchestrator
from agents.category_1.a1_visual_acquisition import VisualAcquisitionAgent
from agents.category_1.more_sensory_agents import AcousticEmissionAgent, VibrationSpectrumAgent, GPSSpeedSyncAgent
from agents.category_1.perception_extra import (
    ThermalImagingAgent, LoadDistributionAgent, EnvironmentalAgent, 
    PowerManagerAgent, DataIntegrityAgent, MultiSpectralFusionAgent
)
from agents.category_2.processing_agents import (
    MotionDeblurringAgent, LowLightEnhancementAgent, CompressedSensingAgent,
    NoiseReductionAgent, SuperResolutionAgent, TemporalInterpolationAgent,
    DataCompressionAgent, AnomalyHighlightingAgent
)
from agents.category_3.a19_bearing_wear import BearingWearPredictor
from agents.category_3.inspection_agents import (
    WheelFlatDetector, AxleCrackTracker, BrakeThicknessEstimator,
    SuspensionMonitor, CouplerIntegrityAgent, RailWheelContactAgent,
    LubricationDetector, FastenerLoosenessAgent, CorrosionSeverityAgent,
    FatigueLifeEstimator, GeometricDistortionAgent
)
from agents.category_4.predictive_agents import (
    TemporalFailurePredictor, EnsembleVotingAgent, UncertaintyQuantificationAgent,
    RareEventDetector, DigitalTwinSynchronizer, WhatIfSimulator,
    HistoricalPatternMatcher, TransferLearningAgent
)
from agents.category_5_6.decision_comm_agents import (
    CriticalityAssessor, UrgencyScheduler, MaintenanceRecommendationAgent,
    AlertPrioritizationAgent, HMIAgent, VoiceAlertSynthesizer,
    MeshNetworkCoordinator, StoreAndForwardAgent, BandwidthAllocator,
    DataSyncAgent, EdgeCloudOrchestrator
)
from agents.category_6.a50_self_healing import SelfHealingMonitor

def load_all_agents(orchestrator: Orchestrator, blackboard):
    """
    Registers all 50 specialized agents with the orchestrator.
    """
    # Category 1: Sensory Perception (A1-A10)
    orchestrator.register_agent(VisualAcquisitionAgent(blackboard))
    orchestrator.register_agent(ThermalImagingAgent(blackboard))
    orchestrator.register_agent(AcousticEmissionAgent(blackboard))
    orchestrator.register_agent(VibrationSpectrumAgent(blackboard))
    orchestrator.register_agent(LoadDistributionAgent(blackboard))
    orchestrator.register_agent(EnvironmentalAgent(blackboard))
    orchestrator.register_agent(GPSSpeedSyncAgent(blackboard))
    orchestrator.register_agent(PowerManagerAgent(blackboard))
    orchestrator.register_agent(DataIntegrityAgent(blackboard))
    orchestrator.register_agent(MultiSpectralFusionAgent(blackboard))

    # Category 2: Data Processing & Enhancement (A11-A18)
    orchestrator.register_agent(MotionDeblurringAgent(blackboard))
    orchestrator.register_agent(LowLightEnhancementAgent(blackboard))
    orchestrator.register_agent(CompressedSensingAgent(blackboard))
    orchestrator.register_agent(NoiseReductionAgent(blackboard))
    orchestrator.register_agent(SuperResolutionAgent(blackboard))
    orchestrator.register_agent(TemporalInterpolationAgent(blackboard))
    orchestrator.register_agent(DataCompressionAgent(blackboard))
    orchestrator.register_agent(AnomalyHighlightingAgent(blackboard))

    # Category 3: Component-Specific Inspection (A19-A30)
    orchestrator.register_agent(BearingWearPredictor(blackboard))
    orchestrator.register_agent(WheelFlatDetector(blackboard))
    orchestrator.register_agent(AxleCrackTracker(blackboard))
    orchestrator.register_agent(BrakeThicknessEstimator(blackboard))
    orchestrator.register_agent(SuspensionMonitor(blackboard))
    orchestrator.register_agent(CouplerIntegrityAgent(blackboard))
    orchestrator.register_agent(RailWheelContactAgent(blackboard))
    orchestrator.register_agent(LubricationDetector(blackboard))
    orchestrator.register_agent(FastenerLoosenessAgent(blackboard))
    orchestrator.register_agent(CorrosionSeverityAgent(blackboard))
    orchestrator.register_agent(FatigueLifeEstimator(blackboard))
    orchestrator.register_agent(GeometricDistortionAgent(blackboard))

    # Category 4: Predictive Modeling (A31-A38)
    orchestrator.register_agent(TemporalFailurePredictor(blackboard))
    orchestrator.register_agent(EnsembleVotingAgent(blackboard))
    orchestrator.register_agent(UncertaintyQuantificationAgent(blackboard))
    orchestrator.register_agent(RareEventDetector(blackboard))
    orchestrator.register_agent(DigitalTwinSynchronizer(blackboard))
    orchestrator.register_agent(WhatIfSimulator(blackboard))
    orchestrator.register_agent(HistoricalPatternMatcher(blackboard))
    orchestrator.register_agent(TransferLearningAgent(blackboard))

    # Category 5: Decision & Alerting (A39-A44)
    orchestrator.register_agent(CriticalityAssessor(blackboard))
    orchestrator.register_agent(UrgencyScheduler(blackboard))
    orchestrator.register_agent(MaintenanceRecommendationAgent(blackboard))
    orchestrator.register_agent(AlertPrioritizationAgent(blackboard))
    orchestrator.register_agent(HMIAgent(blackboard))
    orchestrator.register_agent(VoiceAlertSynthesizer(blackboard))

    # Category 6: Communication & Resilience (A45-A50)
    orchestrator.register_agent(MeshNetworkCoordinator(blackboard))
    orchestrator.register_agent(StoreAndForwardAgent(blackboard))
    orchestrator.register_agent(BandwidthAllocator(blackboard))
    orchestrator.register_agent(DataSyncAgent(blackboard))
    orchestrator.register_agent(EdgeCloudOrchestrator(blackboard))
    orchestrator.register_agent(SelfHealingMonitor(blackboard, orchestrator))

    print(f"RAILGUARD 5000: Full cognitive load active ({len(orchestrator.agents)}/50 agents initialized)")

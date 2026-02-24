import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.orchestrator import Orchestrator
from backend.blackboard import Blackboard

# Import from our new combined agent files
from agents.category_1_and_2 import (
    VisualAcquisitionAgent, ThermalImagingAgent, AcousticEmissionAgent,
    VibrationSpectrumAgent, LoadDistributionAgent, EnvironmentalContextAgent,
    GPSSpeedSyncAgent, PowerManagementAgent, DataIntegrityAgent,
    MultiSpectralFusionAgent, MotionDeblurringAgent, LowLightEnhancementAgent,
    CompressedSensingAgent, NoiseReductionAgent, SuperResolutionAgent,
    TemporalInterpolationAgent, DataCompressionAgent, AnomalyHighlightingAgent
)
from agents.category_3 import (
    BearingWearPredictor, WheelFlatSpotDetector, AxleCrackPropagationTracker,
    BrakePadThicknessEstimator, SuspensionHealthMonitor, CouplerIntegrityAgent,
    RailWheelContactAgent, LubricationDeficiencyDetector, FastenerLoosenessAgent,
    CorrosionSeverityAgent, FatigueLifeEstimator, GeometricDistortionAgent
)
from agents.category_4_5_6 import (
    TemporalFailurePredictor, EnsembleVotingAgent, UncertaintyQuantificationAgent,
    RareEventDetector, DigitalTwinSynchronizer, WhatIfSimulator,
    HistoricalPatternMatcher, TransferLearningAgent, CriticalityAssessor,
    UrgencyScheduler, MaintenanceRecommendationAgent, AlertPrioritizationAgent,
    HumanMachineInterfaceAgent, VoiceAlertSynthesizer, MeshNetworkCoordinator,
    StoreAndForwardAgent, BandwidthAllocator, DataSynchronizationAgent,
    EdgeCloudOrchestrator, SelfHealingMonitor
)

def load_all_agents(orchestrator: Orchestrator, blackboard):
    """
    Registers all 50 specialized agents with the orchestrator.
    """
    # Category 1: Sensory Perception (A1-A10)
    orchestrator.register_agent(VisualAcquisitionAgent("A1", "Visual Acquisition"))
    orchestrator.register_agent(ThermalImagingAgent("A2", "Thermal Imaging"))
    orchestrator.register_agent(AcousticEmissionAgent("A3", "Acoustic Emission"))
    orchestrator.register_agent(VibrationSpectrumAgent("A4", "Vibration Spectrum"))
    orchestrator.register_agent(LoadDistributionAgent("A5", "Load Distribution"))
    orchestrator.register_agent(EnvironmentalContextAgent("A6", "Environmental Context"))
    orchestrator.register_agent(GPSSpeedSyncAgent("A7", "GPS/Speed Sync"))
    orchestrator.register_agent(PowerManagementAgent("A8", "Power Management"))
    orchestrator.register_agent(DataIntegrityAgent("A9", "Data Integrity"))
    orchestrator.register_agent(MultiSpectralFusionAgent("A10", "Multi-Spectral Fusion"))

    # Category 2: Data Processing & Enhancement (A11-A18)
    orchestrator.register_agent(MotionDeblurringAgent("A11", "Motion Deblurring"))
    orchestrator.register_agent(LowLightEnhancementAgent("A12", "Low-Light Enhancement"))
    orchestrator.register_agent(CompressedSensingAgent("A13", "Compressed Sensing"))
    orchestrator.register_agent(NoiseReductionAgent("A14", "Noise Reduction"))
    orchestrator.register_agent(SuperResolutionAgent("A15", "Super-Resolution"))
    orchestrator.register_agent(TemporalInterpolationAgent("A16", "Temporal Interpolation"))
    orchestrator.register_agent(DataCompressionAgent("A17", "Data Compression"))
    orchestrator.register_agent(AnomalyHighlightingAgent("A18", "Anomaly Highlighting"))

    # Category 3: Component-Specific Inspection (A19-A30)
    orchestrator.register_agent(BearingWearPredictor("A19", "Bearing Wear Predictor"))
    orchestrator.register_agent(WheelFlatSpotDetector("A20", "Wheel Flat Spot Detector"))
    orchestrator.register_agent(AxleCrackPropagationTracker("A21", "Axle Crack Propagation"))
    orchestrator.register_agent(BrakePadThicknessEstimator("A22", "Brake Pad Thickness"))
    orchestrator.register_agent(SuspensionHealthMonitor("A23", "Suspension Health Monitor"))
    orchestrator.register_agent(CouplerIntegrityAgent("A24", "Coupler Integrity"))
    orchestrator.register_agent(RailWheelContactAgent("A25", "Rail-Wheel Contact"))
    orchestrator.register_agent(LubricationDeficiencyDetector("A26", "Lubrication Deficiency"))
    orchestrator.register_agent(FastenerLoosenessAgent("A27", "Fastener Looseness"))
    orchestrator.register_agent(CorrosionSeverityAgent("A28", "Corrosion Severity"))
    orchestrator.register_agent(FatigueLifeEstimator("A29", "Fatigue Life Estimator"))
    orchestrator.register_agent(GeometricDistortionAgent("A30", "Geometric Distortion"))

    # Category 4: Predictive Modeling (A31-A38)
    orchestrator.register_agent(TemporalFailurePredictor("A31", "Temporal Failure Predictor"))
    orchestrator.register_agent(EnsembleVotingAgent("A32", "Ensemble Voting"))
    orchestrator.register_agent(UncertaintyQuantificationAgent("A33", "Uncertainty Quantification"))
    orchestrator.register_agent(RareEventDetector("A34", "Rare Event Detector"))
    orchestrator.register_agent(DigitalTwinSynchronizer("A35", "Digital Twin Synchronizer"))
    orchestrator.register_agent(WhatIfSimulator("A36", "What-If Simulator"))
    orchestrator.register_agent(HistoricalPatternMatcher("A37", "Historical Pattern Matcher"))
    orchestrator.register_agent(TransferLearningAgent("A38", "Transfer Learning"))

    # Category 5: Decision & Alerting (A39-A44)
    orchestrator.register_agent(CriticalityAssessor("A39", "Criticality Assessor"))
    orchestrator.register_agent(UrgencyScheduler("A40", "Urgency Scheduler"))
    orchestrator.register_agent(MaintenanceRecommendationAgent("A41", "Maintenance Recommendation"))
    orchestrator.register_agent(AlertPrioritizationAgent("A42", "Alert Prioritization"))
    orchestrator.register_agent(HumanMachineInterfaceAgent("A43", "HMI Agent"))
    orchestrator.register_agent(VoiceAlertSynthesizer("A44", "Voice Alert Synthesizer"))

    # Category 6: Communication & Resilience (A45-A50)
    orchestrator.register_agent(MeshNetworkCoordinator("A45", "Mesh Network Coordinator"))
    orchestrator.register_agent(StoreAndForwardAgent("A46", "Store-and-Forward"))
    orchestrator.register_agent(BandwidthAllocator("A47", "Bandwidth Allocator"))
    orchestrator.register_agent(DataSynchronizationAgent("A48", "Data Synchronization"))
    orchestrator.register_agent(EdgeCloudOrchestrator("A49", "Edge-Cloud Orchestrator"))
    orchestrator.register_agent(SelfHealingMonitor("A50", "Self-Healing Monitor"))

    print(f"RAILGUARD 5000: Full cognitive load active ({len(orchestrator.agents)}/50 agents initialized)")

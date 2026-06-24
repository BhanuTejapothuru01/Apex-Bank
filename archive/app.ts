/**
 * EquiRisk Cinematic Underwriting Platform - app.ts
 * Implements a full-screen cinematic, interactive 10-step animated loan journey.
 * Uses vanilla TS with kinetic particle pathways and dynamic custom formulas.
 */

declare const lucide: any;
declare const bootstrap: any;

// Coordinate representation for any pathway Node
interface StepCoords {
  x: number;
  y: number;
}

// User-modifiable borrower data payload
interface ApplicantPayload {
  name: string;
  capital: number;
  fico: number;
  income: number;
}

// Global Animation State Controller
class CinematicController {
  // Current animated Story step index (0 to 9)
  public activeStep: number = 0;
  public totalSteps: number = 10;
  public isPlaying: boolean = false;
  public playbackSpeed: number = 2200; // time per step in ms (Default 1x)
  private playIntervalId: any = null;
  
  // Custom applicant data
  public applicant: ApplicantPayload = {
    name: "Eleanor Jenkins",
    capital: 250000,
    fico: 780,
    income: 12500
  };

  // Node coordinates mapping inside SVC coordinate stage (800 x 500)
  private stepCoords: StepCoords[] = [
    { x: 120, y: 400 }, // Step 1: Ingest
    { x: 150, y: 250 }, // Step 2: Routing
    { x: 250, y: 220 }, // Step 3: Checkpoints Match
    { x: 500, y: 180 }, // Step 4: AI Risk scan
    { x: 430, y: 420 }, // Step 5: FICO speed meter
    { x: 680, y: 310 }, // Step 6: Protection Shield
    { x: 610, y: 130 }, // Step 7: Approved Meter filled
    { x: 180, y: 240 }, // Step 8: Liquidity dispatch speedway
    { x: 110, y: 110 }, // Step 9: Customer welcome loyalty
    { x: 350, y: 250 }  // Step 10: Amortization analytical graphs
  ];

  // Map wire connections between steps
  private wireIds: string[] = [
    "wire-p1", "wire-p2", "wire-p3", "wire-p4", "wire-p5", "wire-p6", "wire-p7", "wire-p8"
  ];

  constructor() {
    this.initEvents();
    this.updateClock();
    this.updateFICOVisualization(this.applicant.fico);
    this.setStep(0); // Inception
    setInterval(() => this.updateClock(), 1000);
  }

  // Bind DOM Event Listeners
  private initEvents() {
    // Customizer input range visual feedback
    const ficoSlider = document.getElementById("cust-fico") as HTMLInputElement;
    if (ficoSlider) {
      ficoSlider.addEventListener("input", (e) => {
        const val = (e.target as HTMLInputElement).value;
        const oInput = document.getElementById("slider-fico-val");
        if (oInput) oInput.innerText = val;
      });
    }

    // Launch custom applicant button
    const launchBtn = document.getElementById("launch-journey-btn");
    if (launchBtn) {
      launchBtn.addEventListener("click", () => {
        this.captureCustomApplicant();
        this.restartJourney();
      });
    }

    // Playback HUD controls
    const playBtn = document.getElementById("hud-play-toggle");
    if (playBtn) {
      playBtn.addEventListener("click", () => this.togglePlayState());
    }

    const nextBtn = document.getElementById("hud-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.incrementStep());
    }

    const prevBtn = document.getElementById("hud-prev");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.decrementStep());
    }

    const restartBtn = document.getElementById("hud-restart");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => this.restartJourney());
    }

    // Speed selections
    const sHalf = document.getElementById("speed-half");
    const sOne = document.getElementById("speed-one");
    const sTwo = document.getElementById("speed-two");

    sHalf?.addEventListener("click", () => this.setPlaybackSpeed(4000, "speed-half"));
    sOne?.addEventListener("click", () => this.setPlaybackSpeed(2200, "speed-one"));
    sTwo?.addEventListener("click", () => this.setPlaybackSpeed(1100, "speed-two"));

    // Side timeline node clicking
    const stepNodes = document.querySelectorAll(".timeline-step-node");
    stepNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const sIndex = parseInt(node.getAttribute("data-step") || "0");
        this.setStep(sIndex);
      });
    });

    // Scrubber click coordinates
    const scrubberTrack = document.getElementById("hud-scrubber-track");
    if (scrubberTrack) {
      scrubberTrack.addEventListener("click", (e) => {
        const rect = scrubberTrack.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const ratio = relativeX / rect.width;
        const targetStep = Math.min(Math.floor(ratio * this.totalSteps), this.totalSteps - 1);
        this.setStep(targetStep);
      });
    }
  }

  // Update UTC Clock in Navbar
  private updateClock() {
    const clockEl = document.getElementById("nav-clock");
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toUTCString().replace("GMT", "UTC");
    }
  }

  // Capture input fields inside applicant customization
  private captureCustomApplicant() {
    const valName = (document.getElementById("cust-name") as HTMLInputElement)?.value.trim() || "Eleanor Jenkins";
    const valCapital = parseFloat((document.getElementById("cust-capital") as HTMLInputElement)?.value) || 250000;
    const valFico = parseInt((document.getElementById("cust-fico") as HTMLInputElement)?.value) || 780;
    const valIncome = parseFloat((document.getElementById("cust-income") as HTMLInputElement)?.value) || 12500;

    this.applicant = {
      name: valName,
      capital: valCapital,
      fico: valFico,
      income: valIncome
    };

    this.writeTelemetry(`[SYSTEM] Modified Applicant: ${valName} | Required: $${valCapital} | FICO: ${valFico}`, "telemetry-warning");
  }

  // Write visual lines into the console logs
  public writeTelemetry(line: string, specClass: string = "") {
    const tBox = document.getElementById("telemetry-box");
    if (!tBox) return;

    const row = document.createElement("div");
    row.className = `telemetry-row ${specClass}`;
    
    const timeMark = new Date().toISOString().substring(11, 19);
    row.innerHTML = `<span class="text-secondary opacity-50">[${timeMark}]</span> ${line}`;
    
    tBox.appendChild(row);
    tBox.scrollTop = tBox.scrollHeight;
  }

  // Set Speed parameters (0.5x, 1x, 2x)
  private setPlaybackSpeed(ms: number, btnId: string) {
    this.playbackSpeed = ms;
    
    // Clear speeds styling active classes
    ["speed-half", "speed-one", "speed-two"].forEach((id) => {
      document.getElementById(id)?.classList.remove("active-speed-btn");
    });

    document.getElementById(btnId)?.classList.add("active-speed-btn");

    if (this.isPlaying) {
      // Refresh timeline loop with new interval rate
      this.pauseStory();
      this.playStory();
    }
  }

  // Toggle Auto playback intervals
  public togglePlayState() {
    if (this.isPlaying) {
      this.pauseStory();
    } else {
      this.playStory();
    }
  }

  private playStory() {
    this.isPlaying = true;
    
    const playText = document.getElementById("hud-play-text");
    const playIcon = document.getElementById("hud-play-icon");
    if (playText) playText.innerText = "Pause Matrix";
    if (playIcon) playIcon.setAttribute("data-lucide", "pause");
    
    if (typeof lucide !== 'undefined') lucide.createIcons();

    this.writeTelemetry("[PLAYBACK] Kinetic loop active", "telemetry-accent");

    this.playIntervalId = setInterval(() => {
      this.incrementStep();
    }, this.playbackSpeed);
  }

  private pauseStory() {
    this.isPlaying = false;
    if (this.playIntervalId) {
      clearInterval(this.playIntervalId);
      this.playIntervalId = null;
    }

    const playText = document.getElementById("hud-play-text");
    const playIcon = document.getElementById("hud-play-icon");
    if (playText) playText.innerText = "Auto-Play";
    if (playIcon) playIcon.setAttribute("data-lucide", "play");

    if (typeof lucide !== 'undefined') lucide.createIcons();
    this.writeTelemetry("[PLAYBACK] Kinetic loop paused", "telemetry-warning");
  }

  private incrementStep() {
    if (this.activeStep >= this.totalSteps - 1) {
      // Loop or pause at end
      this.pauseStory();
      this.writeTelemetry("[PLAYBACK] End of cinematic process story reached");
      return;
    }
    this.setStep(this.activeStep + 1);
  }

  private decrementStep() {
    if (this.activeStep <= 0) return;
    this.setStep(this.activeStep - 1);
  }

  private restartJourney() {
    this.writeTelemetry("[SYSTEM] Resetting journey cinematic registers to inception...", "telemetry-accent");
    this.setStep(0);
    if (!this.isPlaying) {
      this.playStory();
    }
  }

  // Transition and trigger specific visual modifications for current step
  public setStep(stepIndex: number) {
    const prevIndex = this.activeStep;
    this.activeStep = stepIndex;

    this.updateHUDPlayControls();
    this.updateTimelineSidelistHighlight();
    this.animateConnectingWiresAndParticles(prevIndex, stepIndex);
    this.toggleFloatingStageOverlayCards(stepIndex);
    this.executeMicroStepBehavior(stepIndex);
  }

  // Highlight side timeline circles
  private updateTimelineSidelistHighlight() {
    const nodes = document.querySelectorAll(".timeline-step-node");
    nodes.forEach((node, idx) => {
      const iconCheck = document.getElementById(`timeline-tick-${idx}`);
      if (idx === this.activeStep) {
        node.classList.add("active-step");
        if (iconCheck) iconCheck.style.opacity = "0"; // hide checkout and show current
      } else {
        node.classList.remove("active-step");
        if (idx < this.activeStep) {
          if (iconCheck) iconCheck.style.opacity = "1"; // tick as completed
        } else {
          if (iconCheck) iconCheck.style.opacity = "0";
        }
      }
    });
  }

  // Refresh progress stats visual counters
  private updateHUDPlayControls() {
    // Scrubber fill & knob percentage position
    const percentage = ((this.activeStep) / (this.totalSteps - 1)) * 100;
    const bar = document.getElementById("hud-scrubber-fill-bar");
    const knob = document.getElementById("hud-scrubber-knob-thumb");
    const indicatorPerc = document.getElementById("hud-completion-percentage");

    if (bar) bar.style.width = `${percentage}%`;
    if (knob) knob.style.left = `${percentage}%`;
    if (indicatorPerc) indicatorPerc.innerText = `${Math.round(percentage)}%`;
  }

  // Animate fluid particle transition along step path nodes
  private animateConnectingWiresAndParticles(from: number, to: number) {
    const startCoord = this.stepCoords[from];
    const endCoord = this.stepCoords[to];

    // Coordinate interpolation trigger
    this.animateNodeSmoothGlide(startCoord.x, startCoord.y, endCoord.x, endCoord.y, 450);

    // Turn connecting wire active classes on
    this.wireIds.forEach((wId, iIdx) => {
      const rPath = document.getElementById(wId);
      if (rPath) {
        rPath.classList.remove("active-wire", "complete-wire");
        if (iIdx < to) {
          rPath.classList.add("complete-wire");
        } else if (iIdx === to) {
          rPath.classList.add("active-wire");
        }
      }
    });
  }

  // Interpolation helper for standard CSS movement of indicator particle along pathways
  private animateNodeSmoothGlide(x1: number, y1: number, x2: number, y2: number, duration: number) {
    const particle = document.getElementById("moving-node-particle");
    const pulse = document.getElementById("moving-pulse-trail");
    if (!particle || !pulse) return;

    // reset particle opacity toggles
    particle.style.opacity = "1";
    pulse.style.opacity = "1";

    const start = performance.now();

    function frame(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth out progression
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currX = x1 + (x2 - x1) * ease;
      const currY = y1 + (y2 - y1) * ease;

      particle.setAttribute("cx", currX.toString());
      particle.setAttribute("cy", currY.toString());
      pulse.setAttribute("cx", currX.toString());
      pulse.setAttribute("cy", currY.toString());

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  // Display/Hide relative step overlay cards
  private toggleFloatingStageOverlayCards(stepIndex: number) {
    // Hide all
    for (let idx = 1; idx <= 10; idx++) {
      const card = document.getElementById(`card-step-${idx}`);
      if (card) {
        card.classList.remove("active-card");
      }
    }

    // Show appropriate card
    const currentCard = document.getElementById(`card-step-${stepIndex + 1}`);
    if (currentCard) {
      currentCard.classList.add("active-card");
    }
  }

  // Calculate standard monthly mortgate amortization
  public calculateMetrics() {
    const principal = this.applicant.capital;
    const income = this.applicant.income;
    const fico = this.applicant.fico;

    // Tier criteria
    let rate = 0.075; // Sub-prime
    let tierText = "POOR CREDIT DEVIANCE";
    let statusId = "Declined";
    let verdictTitle = "RECOMMEND: REFUSED";
    let messageBody = "Application declined under policy guidelines. Credit representation does not qualify for automated funding.";

    if (fico >= 720) {
      rate = 0.0425;
      tierText = "SUPER PRIME RESERVE";
      statusId = "Approved";
      verdictTitle = "RECOMMEND: AUTO-APPROVED";
      messageBody = "Outstanding capital profile. Verified metrics support secure, automated direct disbursement.";
    } else if (fico >= 660) {
      rate = 0.0535;
      tierText = "PRIME STABLE BUFFER";
      statusId = "Review";
      verdictTitle = "RECOMMEND: CONDITIONAL REVIEW";
      messageBody = "Indicators average standard tolerances. Forwarded to risk liaison for conditional review approval.";
    }

    // Amortize
    const monthlyRate = rate / 12;
    const periods = 360; // 30 Yr Fixed
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, periods)) / (Math.pow(1 + monthlyRate, periods) - 1);
    const dti = Math.round((monthlyPayment / income) * 100);

    // Override Declined if DTI becomes catastrophic
    if (dti > 45) {
      statusId = "Declined";
      verdictTitle = "RECOMMEND: DEBT-EXCESSIVE REFUSED";
      messageBody = `Debt-to-Income leverage coefficient of ${dti}% is above maximum Switzerland buffer compliance of 45%.`;
    }

    const totalInterest = (monthlyPayment * periods) - principal;

    return {
      rate,
      monthlyPayment,
      dti,
      statusId,
      verdictTitle,
      messageBody,
      totalInterest,
      tierText
    };
  }

  // Execute specific state transformations inside current cards
  private executeMicroStepBehavior(stepIndex: number) {
    const metrics = this.calculateMetrics();

    switch (stepIndex) {
      case 0: // Step 1: Ingestion
        this.writeTelemetry(`[INGEST] Application received. Generating payload signature...`);
        
        // Update elements
        const nameNode1 = document.getElementById("card1-name");
        if (nameNode1) nameNode1.textContent = this.applicant.name;

        const capitalNode1 = document.getElementById("card1-capital");
        if (capitalNode1) capitalNode1.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(this.applicant.capital);

        const incomeNode1 = document.getElementById("card1-income");
        if (incomeNode1) incomeNode1.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(this.applicant.income) + "/mo";

        document.getElementById("card1-hash")!.textContent = "HASH: e92b..." + Math.floor(100 + Math.random() * 900);
        
        // Load miniature mock bar
        const card1Prog = document.getElementById("card1-progress");
        if (card1Prog) {
          card1Prog.style.width = "0%";
          setTimeout(() => { card1Prog.style.width = "100%"; }, 50);
        }
        break;

      case 1: // Step 2: Routing speed fiber-optic
        this.writeTelemetry(`[ROUTER] Encrypting client payload packets with SOC2 military protocols...`, "telemetry-accent");
        this.writeTelemetry(`[SYSTEM] Transferred packets successfully through active matrix corridors.`);
        break;

      case 2: // Step 3: Verification document nodes checklists
        this.writeTelemetry(`[REGISTRY] Contacting multi-jurisdictional verification checkpoints...`);
        this.resetVerificationChecklistItems();
        break;

      case 3: // Step 4: AI scans
        this.writeTelemetry(`[AI RISK] Sweeping vertical scanning laser sweeps. Calculating matrices...`);
        
        const card4DtiNode = document.getElementById("card4-dti");
        if (card4DtiNode) {
          card4DtiNode.textContent = `${metrics.dti}% DTI Ratio`;
          card4DtiNode.className = metrics.dti > 45 ? "text-danger text-bold" : "text-success text-bold";
        }
        break;

      case 4: // Step 5: FICO speedometer Dial needle rotational value
        this.writeTelemetry(`[AUDIT] Pulling credit records. Needle spinning...`);
        this.updateFICOVisualization(this.applicant.fico);
        break;

      case 5: // Step 6: Anti-fraud shield mesh activates
        this.writeTelemetry(`[SECURITY] Anti-fraud protection grids initializing...`, "telemetry-accent");
        this.writeTelemetry(`[SECURITY] Geolocation node matching... IP Verified.`);
        break;

      case 6: // Step 7: Approved Meter progress meter bar fills
        this.writeTelemetry(`[DECISION] Rating parameters complete: DTI rating: ${metrics.dti}%, FICO tier result: ${metrics.tierText}.`);
        
        // Progress filling inside overlay card
        const decisionBadg = document.getElementById("card7-decision-badge");
        if (decisionBadg) {
          decisionBadg.textContent = metrics.verdictTitle;
          decisionBadg.className = "badge-custom-cyber " + (metrics.statusId === "Approved" ? "status-pass" : (metrics.statusId === "Review" ? "status-warn" : "status-fail"));
        }

        const msgNode = document.getElementById("card7-message");
        if (msgNode) msgNode.textContent = metrics.messageBody;

        const percNode = document.getElementById("card7-percent");
        const barFill = document.getElementById("card7-progress-fill");
        
        if (percNode && barFill) {
          percNode.textContent = "0%";
          barFill.style.width = "0%";
          
          setTimeout(() => {
            percNode.textContent = "100%";
            barFill.style.width = "100%";
          }, 150);
        }
        break;

      case 7: // Step 8: Golden cash transfer sparks
        this.writeTelemetry(`[DISBURSER] Liquidity clearing protocols initiated... dispatching assets code payload.`, "telemetry-warning");
        this.triggerSplendidCashCoinParticleRains(metrics.statusId === "Approved");
        break;

      case 8: // Step 9: Customer успех
        this.writeTelemetry(`[SUCCESS] Client verification account initialized.`);
        
        // Update welcome portrait
        const nameSuccessNode = document.getElementById("card9-name");
        if (nameSuccessNode) nameSuccessNode.textContent = this.applicant.name;

        // Initials
        const charNode = document.getElementById("card9-avatar-char");
        if (charNode) {
          const initials = this.applicant.name
            .split(" ")
            .map((p) => p.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();
          charNode.textContent = initials || "EJ";
        }
        break;

      case 9: // Step 10: Predictive multi-graphs bloom
        this.writeTelemetry(`[ANALYTICS] Generatel multi-dimensional predictive graphs in matrix...`, "telemetry-accent");
        
        const card10P = document.getElementById("card10-princ");
        if (card10P) card10P.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(this.applicant.capital);

        const card10Int = document.getElementById("card10-interest");
        if (card10Int) card10Int.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metrics.totalInterest);
        break;
    }
  }

  // Update FICO circle path offsets & rotating pointer
  private updateFICOVisualization(fico: number) {
    const scoreVal = document.getElementById("card5-fico");
    if (scoreVal) scoreVal.textContent = fico.toString();

    const tierNode = document.getElementById("card5-tier");
    if (tierNode) {
      if (fico >= 720) {
        tierNode.textContent = "SUPER PRIME RATE";
        tierNode.className = "font-mono-tech text-success";
      } else if (fico >= 660) {
        tierNode.textContent = "CO-PRIME OPTIMAL";
        tierNode.className = "font-mono-tech text-info";
      } else {
        tierNode.textContent = "SUB-PRIME HIGHER RISK";
        tierNode.className = "font-mono-tech text-danger";
      }
    }

    // rotation mapping
    const ratio = (fico - 350) / (850 - 350); // clamp 350 to 850
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const degrees = -90 + clampedRatio * 180; // range from -90 to 90 degrees

    const needle = document.getElementById("fico-gauge-needle");
    if (needle) needle.style.transform = `rotate(${degrees}deg)`;

    const gaugePath = document.getElementById("fico-gauge-path") as any;
    if (gaugePath) {
      // 188 total circumference, offset based on fraction
      const strokeSize = 188 - (188 * clampedRatio);
      gaugePath.style.strokeDashoffset = strokeSize.toString();
    }
  }

  // Sequenced loading checks in Step 3
  private resetVerificationChecklistItems() {
    const list = [
      { id: "chk-doc-1", txt: "Tax Returns Verification Index" },
      { id: "chk-doc-2", txt: "Identity biometric validation match" },
      { id: "chk-doc-3", txt: "Legal assets joint collateral lookup" }
    ];

    list.forEach((doc, idx) => {
      const parent = document.getElementById(doc.id);
      if (parent) {
        parent.classList.remove("passed");
        parent.innerHTML = `
          <div class="spinner-border text-info" role="status" style="width:12px; height:12px;"></div>
          <span>${doc.txt}</span>
        `;
        
        setTimeout(() => {
          parent.classList.add("passed");
          parent.innerHTML = `
            <i data-lucide="check-circle-2" class="checklist-icon text-success" style="width:14px; height:14px;"></i>
            <span class="text-white-50">${doc.txt}:</span>&nbsp;<strong class="text-success">VERIFIED</strong>
          `;
          if (typeof lucide !== 'undefined') lucide.createIcons();
          this.writeTelemetry(`[REGISTRY] Checked checkpoint ${idx+1}/3 successfully.`);
        }, 350 + idx * 450);
      }
    });
  }

  // Spawn visual coins across stage path
  private triggerSplendidCashCoinParticleRains(isApproved: boolean) {
    const container = document.getElementById("cash-container");
    const amountVal = document.getElementById("card8-amount");

    if (!container || !amountVal) return;
    container.innerHTML = "";

    if (!isApproved) {
      amountVal.textContent = "BLOCKED";
      amountVal.className = "text-danger fw-bold";
      this.writeTelemetry(`[SYSTEM] Settlement transaction blocked due to subprime credit scores.`, "telemetry-alert");
      return;
    }

    amountVal.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(this.applicant.capital);
    amountVal.className = "text-warning font-mono-tech fw-bold";

    // Create 15 cascading particles
    for (let index = 0; index < 20; index++) {
      setTimeout(() => {
        const coin = document.createElement("div");
        coin.className = "cash-particle-flow";
        coin.style.left = `${100 + Math.random() * 200}px`;
        coin.style.bottom = `${120 + Math.random() * 80}px`;
        coin.style.opacity = "1";
        
        container.appendChild(coin);

        // Slide down to vault (simulate via translate css)
        coin.style.transition = "all 0.8s cubic-bezier(0.1, 0.45, 0.1, 1)";
        setTimeout(() => {
          coin.style.transform = `translate(-140px, 80px) scale(0)`;
          coin.style.opacity = "0";
        }, 50);

        setTimeout(() => coin.remove(), 1000);
      }, index * 45);
    }
  }
}

// Instantiate on load
document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Create global controller instance
  (window as any).journeyControl = new CinematicController();
});

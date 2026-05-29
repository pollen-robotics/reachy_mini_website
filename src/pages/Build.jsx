import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Link,
  Chip,
  Tabs,
  Tab,
  Alert,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';

import Layout from '../components/Layout';
import PageHero from '../components/PageHero';

// Code Block component with copy functionality
function CodeBlock({ code, language = 'bash', title }) {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    }
    return hljs.highlightAuto(code).value;
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: '#0d1117',
        borderRadius: 2,
        overflow: 'hidden',
        my: 2,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
          {title || language}
        </Typography>
        <Button
          size="small"
          onClick={handleCopy}
          startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
          sx={{
            color: copied ? '#22c55e' : 'rgba(255,255,255,0.6)',
            fontSize: 12,
            minWidth: 'auto',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          overflow: 'auto',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: 13,
          lineHeight: 1.7,
          color: '#e6edf3',
          '& code': {
            display: 'block',
          },
        }}
      >
        <code
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </Box>
    </Box>
  );
}

// Tab Panel
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: 16 }}>
      {value === index && children}
    </div>
  );
}

// Section component
function Section({ id, step, title, children }) {
  return (
    <Box id={id} sx={{ mb: 10, scrollMarginTop: 100 }}>
      <Box sx={{ mb: 3 }}>
        {step && (
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'text.secondary',
              letterSpacing: 2,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {step}
          </Typography>
        )}
        <Typography variant="h3" sx={{ mt: step ? 0.5 : 0 }}>{title}</Typography>
      </Box>
      {children}
    </Box>
  );
}

export default function Build() {
  const [osTab, setOsTab] = useState(0);

  return (
    <Layout transparentHeader>
      <PageHero
        eyebrow="Developer Guide"
        title="Create with Reachy Mini"
        subtitle="Create amazing experiences with Python or JavaScript. Control movements, access sensors, build apps, and share them with the community."
        accentColor="#764ba2"
        stickers={[
          { src: '/assets/reachies/hacker.png', size: 260, top: 10, left: 100, rotation: -12 },
          { src: '/assets/reachies/student.png', size: 220, bottom: 0, right: 120, rotation: 8 },
        ]}
        primitives={[
          { type: 'squareOutline', color: '#764ba2', size: 90, top: 60, right: 180, rotation: 20 },
          { type: 'circle', color: '#667eea', size: 50, bottom: 80, left: 120 },
        ]}
      >
        <Button
          variant="contained"
          href="#install"
          sx={{
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          }}
        >
          Install SDK
        </Button>
        <Button
          variant="outlined"
          href="https://huggingface.co/docs/reachy_mini/SDK/installation"
          target="_blank"
          endIcon={<OpenInNewIcon />}
          sx={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          GitHub
        </Button>
      </PageHero>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Prerequisites notice */}
        <Box
          sx={{
            mb: 6,
            p: 4,
            borderRadius: 3,
            bgcolor: '#f5f5f7',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Box
            component="img"
            src="/assets/reachy-stop.svg"
            alt=""
            sx={{
              width: 120,
              height: 120,
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1d1d1f' }}>
              Before you start
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#86868b', lineHeight: 1.6 }}>
              Make sure you have assembled your Reachy Mini and connected it.
              If not, follow the{' '}
              <Link component={RouterLink} to="/getting-started" sx={{ color: '#1d1d1f', fontWeight: 600 }}>
                Getting Started guide
              </Link>{' '}
              first.
            </Typography>
          </Box>
        </Box>

        {/* Section: Install SDK */}
        <Section id="install" step="Step 1" title="Install the SDK">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
            The Reachy Mini SDK is a Python package that lets you control the robot programmatically.
            It includes both the daemon (background service) and the control API.
          </Typography>

          {/* Prerequisites */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Prerequisites
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <CheckCircleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="h6">Python 3.10 - 3.13</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    We recommend using a virtual environment.
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <CheckCircleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="h6">Git LFS</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Required for large model files.
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <CheckCircleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="h6">Reachy Mini connected</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    USB (Lite) or Wi-Fi (Wireless).
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Install Git LFS
              </Typography>
              <Tabs value={osTab} onChange={(_, v) => setOsTab(v)} sx={{ mb: 2 }}>
                <Tab label="Linux" />
                <Tab label="macOS" />
                <Tab label="Windows" />
              </Tabs>

              <TabPanel value={osTab} index={0}>
                <CodeBlock code="sudo apt install git-lfs" />
              </TabPanel>
              <TabPanel value={osTab} index={1}>
                <CodeBlock code="brew install git-lfs" />
              </TabPanel>
              <TabPanel value={osTab} index={2}>
                <Typography variant="body2" color="text.secondary">
                  Download from{' '}
                  <Link href="https://git-lfs.com" target="_blank">
                    git-lfs.com
                  </Link>
                </Typography>
              </TabPanel>
            </Box>
          </Box>

          {/* Installation */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Install Reachy Mini
              </Typography>

              <CodeBlock
                title="Terminal"
                code={`# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate

# Install the SDK
pip install reachy-mini`}
              />

              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>uv users:</strong> Run <code>uv run reachy-mini-daemon</code> directly without manual setup.
                </Typography>
              </Alert>
            </Box>
          </Box>

          {/* Linux udev */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>🐧 Linux: Set up udev rules (required for USB connection)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CodeBlock
                code={`# Create udev rules
echo 'SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="55d3", MODE="0666", GROUP="dialout"
SUBSYSTEM=="tty", ATTRS{idVendor}=="38fb", ATTRS{idProduct}=="1001", MODE="0666", GROUP="dialout"' \\
| sudo tee /etc/udev/rules.d/99-reachy-mini.rules

# Reload rules and add user to dialout group
sudo udevadm control --reload-rules && sudo udevadm trigger
sudo usermod -aG dialout $USER

# Log out and back in for changes to take effect`}
              />
            </AccordionDetails>
          </Accordion>
        </Section>

        <Divider sx={{ my: 8 }} />

        {/* Section: First Script */}
        <Section id="first-script" step="Step 2" title="Your First Script">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
            Before running any script, you need to start the daemon. The daemon handles communication 
            with the robot's motors and sensors.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    1. Start the Daemon
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Open a terminal and run:
                  </Typography>
                  <CodeBlock code="reachy-mini-daemon" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    For simulation (no robot needed):
                  </Typography>
                  <CodeBlock code="pip install reachy-mini[mujoco]
reachy-mini-daemon --sim" />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    2. Run Your First Script
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    In another terminal, create <code>hello.py</code>:
                  </Typography>
                  <CodeBlock
                    language="python"
                    code={`from reachy_mini import ReachyMini

with ReachyMini() as mini:
    print("Connected!")
    print(f"Robot state: {mini.state}")`}
                  />
                  <CodeBlock code="python hello.py" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Section>

        <Divider sx={{ my: 8 }} />

        {/* Section: Control the Robot */}
        <Section id="control" step="Step 3" title="Control the Robot">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
            Use <code>goto_target</code> for smooth movements and <code>set_target</code> for immediate control.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Move the Head
                  </Typography>
                  <CodeBlock
                    language="python"
                    code={`from reachy_mini import ReachyMini
from reachy_mini.utils import create_head_pose

with ReachyMini() as mini:
    # Move head up and tilt
    pose = create_head_pose(
        z=10,      # 10mm up
        roll=15,   # 15° tilt
        degrees=True, 
        mm=True
    )
    mini.goto_target(head=pose, duration=2.0)
    
    # Reset to default
    mini.goto_target(
        head=create_head_pose(), 
        duration=1.0
    )`}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Control Antennas & Body
                  </Typography>
                  <CodeBlock
                    language="python"
                    code={`import numpy as np
from reachy_mini import ReachyMini
from reachy_mini.utils import create_head_pose

with ReachyMini() as mini:
    # Move everything at once
    mini.goto_target(
        head=create_head_pose(y=-10, mm=True),
        antennas=np.deg2rad([45, 45]),
        body_yaw=np.deg2rad(30),
        duration=2.0,
    )
    
    # Make antennas wave
    for _ in range(3):
        mini.goto_target(
            antennas=np.deg2rad([60, 20]),
            duration=0.3
        )
        mini.goto_target(
            antennas=np.deg2rad([20, 60]),
            duration=0.3
        )`}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Motor Control Modes
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1 }}>
                    enable_motors()
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Powers motors ON. Robot holds position firmly.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1 }}>
                    disable_motors()
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Powers motors OFF. Robot is completely limp.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1 }}>
                    make_motors_compliant()
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Motors ON but soft. Great for teaching-by-demonstration.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Section>

        <Divider sx={{ my: 8 }} />

        {/* Section: Access Sensors */}
        <Section id="sensors" step="Step 4" title="Access Sensors">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
            Reachy Mini has a camera, microphones, speaker, and accelerometer (wireless version).
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    📷 Camera
                  </Typography>
                  <CodeBlock
                    language="python"
                    code={`import cv2
from reachy_mini import ReachyMini

with ReachyMini() as mini:
    # Get a frame (numpy array)
    frame = mini.media.get_frame()
    
    # Display with OpenCV
    cv2.imshow("Reachy View", frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    
    # Or save to file
    cv2.imwrite("snapshot.jpg", frame)`}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    🎤 Microphone
                  </Typography>
                  <CodeBlock
                    language="python"
                    code={`from reachy_mini import ReachyMini

with ReachyMini() as mini:
    # Get audio sample
    sample = mini.media.get_audio_sample()
    
    # sample is a numpy array
    # Process with your favorite 
    # audio/speech library`}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    🔊 Speaker
                  </Typography>
                  <CodeBlock
                    language="python"
                    code={`from reachy_mini import ReachyMini

with ReachyMini() as mini:
    # Play audio file
    mini.media.play_audio("hello.wav")
    
    # Or use TTS (with external lib)
    # and play the generated audio`}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    📐 Accelerometer (Wireless only)
                  </Typography>
                  <CodeBlock
                    language="python"
                    code={`from reachy_mini import ReachyMini

with ReachyMini() as mini:
    # Get accelerometer data
    accel = mini.sensors.accelerometer
    
    print(f"X: {accel.x}")
    print(f"Y: {accel.y}")
    print(f"Z: {accel.z}")`}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Section>

        <Divider sx={{ my: 8 }} />

        {/* Section: Create an App */}
        <Section id="create-app" step="Step 5" title="Create an App">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
            Package your code as a Reachy Mini app that can be installed from the dashboard.
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Generate App Template
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use the built-in generator to create a complete project structure:
              </Typography>
              <CodeBlock code="reachy-mini-make-app my_awesome_app" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This creates: <code>pyproject.toml</code>, <code>README.md</code>, and the main app file.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                App Structure
              </Typography>
              <CodeBlock
                language="python"
                title="my_awesome_app/app.py"
                code={`from reachy_mini.apps.app import ReachyMiniApp
from reachy_mini import ReachyMini

class MyAwesomeApp(ReachyMiniApp):
    """My first Reachy Mini app!"""
    
    def run(self, reachy_mini: ReachyMini, stop_event):
        \"\"\"Main app logic. Called when the app starts.\"\"\"
        
        while not stop_event.is_set():
            # Your code here
            # Check stop_event periodically to allow clean shutdown
            
            # Example: wave antennas
            reachy_mini.goto_target(
                antennas=[0.5, -0.5],
                duration=0.5
            )
            reachy_mini.goto_target(
                antennas=[-0.5, 0.5],
                duration=0.5
            )`}
              />
            </Box>
          </Box>
        </Section>

        <Divider sx={{ my: 8 }} />

        {/* Section: Publish to HF */}
        <Section id="publish" step="Step 6" title="Publish to Hugging Face">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
            Share your app with the community on Hugging Face Spaces. Apps published there 
            can be installed directly from the Reachy Mini dashboard.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    1. Create a Space
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Go to Hugging Face and create a new Space:
                  </Typography>
                  <Button
                    variant="outlined"
                    href="https://huggingface.co/new-space"
                    target="_blank"
                    endIcon={<OpenInNewIcon />}
                  >
                    Create New Space
                  </Button>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Choose "Gradio" or "Static" as the SDK.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    2. Add the reachy_mini tag
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    In your Space's <code>README.md</code>, add this tag:
                  </Typography>
                  <CodeBlock
                    language="yaml"
                    code={`---
title: My Awesome App
emoji: 🤖
tags:
  - reachy_mini  # This makes it discoverable!
---`}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Alert severity="success" sx={{ mt: 4 }}>
            <Typography variant="body2">
              <strong>That's it!</strong> Your app will now appear in the Reachy Mini dashboard's app store
              and on the{' '}
              <Link component={RouterLink} to="/apps">
                Apps page
              </Link>
              .
            </Typography>
          </Alert>
        </Section>

        <Divider sx={{ my: 8 }} />

        {/* REST API Section */}
        <Section id="rest-api" title="REST API">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
            Prefer HTTP? The daemon exposes a REST API for language-agnostic control.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Get Robot State
                  </Typography>
                  <CodeBlock
                    language="bash"
                    code={`curl http://localhost:8000/api/state/full`}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    API Documentation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Full OpenAPI docs available when daemon is running:
                  </Typography>
                  <Button
                    variant="outlined"
                    href="http://localhost:8000/docs"
                    target="_blank"
                    endIcon={<OpenInNewIcon />}
                  >
                    Open API Docs
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Section>

        {/* Next Steps */}
        <Box
          sx={{
            mt: 10,
            p: 6,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
            border: '1px solid rgba(118, 75, 162, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Ready to explore more?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Check out the full documentation and community apps for inspiration.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              href="https://huggingface.co/docs/reachy_mini/SDK/readme"
              target="_blank"
              endIcon={<OpenInNewIcon />}
            >
              Full SDK Documentation
            </Button>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/apps"
            >
              Browse Community Apps
            </Button>
            <Button
              variant="outlined"
              component="a"
              href="https://huggingface.co/docs/reachy_mini/troubleshooting"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAQ
            </Button>
          </Stack>
        </Box>
      </Container>
    </Layout>
  );
}

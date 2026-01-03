// Computer Networks Questions with Enhanced Details
export interface Question {
  id: string;
  category: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  description: string;
  frequency: number;
  companies: string[];
  answer: string;
}

export const cnQuestions: Question[] = [
  {
    id: "cn-1",
    category: "Network Basics",
    title: "OSI Model Layers",
    difficulty: "EASY",
    points: 1,
    description: "Explain 7 layers of OSI model",
    frequency: 85,
    companies: ["Google", "Amazon", "Microsoft", "Meta", "Apple"],
    answer: `The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes network communication into 7 distinct layers:

Layer 7 - Application Layer:
• Closest to the end user
• Provides network services to applications
• Protocols: HTTP, HTTPS, FTP, SMTP, DNS
• Example: Web browsers, email clients

Layer 6 - Presentation Layer:
• Data translation and encryption
• Format conversion (ASCII, JPEG, MPEG)
• Compression and decompression
• Example: SSL/TLS encryption

Layer 5 - Session Layer:
• Manages sessions between applications
• Establishes, maintains, and terminates connections
• Handles authentication and reconnection
• Example: NetBIOS, RPC

Layer 4 - Transport Layer:
• End-to-end communication and reliability
• Segmentation and reassembly of data
• Protocols: TCP (reliable), UDP (unreliable but fast)
• Port numbers for process identification

Layer 3 - Network Layer:
• Routing and logical addressing
• IP addressing and packet forwarding
• Protocols: IP, ICMP, ARP
• Determines best path for data delivery

Layer 2 - Data Link Layer:
• Physical addressing (MAC addresses)
• Frame creation and error detection
• Controls access to physical medium
• Protocols: Ethernet, PPP, Switch operations

Layer 1 - Physical Layer:
• Transmission of raw bit streams
• Physical characteristics (cables, voltages, pins)
• Hardware specifications
• Example: Cables, hubs, repeaters

Key Interview Points:
• Remember mnemonic: "Please Do Not Throw Sausage Pizza Away"
• Each layer adds its own header (encapsulation)
• OSI is theoretical; TCP/IP is practical implementation
• Lower layers are hardware-focused, upper layers are software-focused`
  },
  {
    id: "cn-2",
    category: "Network Basics",
    title: "TCP vs UDP",
    difficulty: "EASY",
    points: 1,
    description: "Differences between TCP and UDP protocols",
    frequency: 92,
    companies: ["Amazon", "Google", "Netflix", "Uber", "Microsoft"],
    answer: `TCP and UDP are two fundamental transport layer protocols with distinct characteristics:

TCP (Transmission Control Protocol):

Characteristics:
• Connection-oriented protocol (requires handshake)
• Reliable data delivery with acknowledgments
• Ordered packet delivery
• Error checking and recovery
• Flow control and congestion control
• Slower but more reliable

Features:
• Three-way handshake for connection establishment
• Sequence numbers for packet ordering
• Retransmission of lost packets
• Header size: 20-60 bytes (larger)

Use Cases:
• Web browsing (HTTP/HTTPS)
• Email (SMTP, IMAP)
• File transfer (FTP)
• Any application requiring data integrity

UDP (User Datagram Protocol):

Characteristics:
• Connectionless protocol (no handshake)
• Unreliable delivery (best-effort)
• No ordering guarantee
• Minimal error checking
• No flow or congestion control
• Faster but less reliable

Features:
• Simple send and forget mechanism
• No acknowledgments
• No retransmission
• Header size: 8 bytes (smaller)

Use Cases:
• Video streaming (YouTube, Netflix)
• Online gaming
• Voice over IP (VoIP)
• DNS queries
• Live broadcasts

When to Choose:
• TCP: When data integrity is critical (banking, file transfers)
• UDP: When speed matters more than reliability (streaming, gaming)`
  },
  {
    id: "cn-3",
    category: "Network Basics",
    title: "IP Addressing and Subnetting",
    difficulty: "MEDIUM",
    points: 2,
    description: "IPv4 addressing, CIDR, and subnet calculations",
    frequency: 78,
    companies: ["Cisco", "Amazon", "Google", "Microsoft", "Oracle"],
    answer: `IP Addressing and Subnetting are fundamental concepts in network design.

IPv4 Addressing:

Structure:
• 32-bit address divided into 4 octets
• Format: xxx.xxx.xxx.xxx (e.g., 192.168.1.1)
• Each octet ranges from 0-255
• Total addresses: approximately 4.3 billion

Address Classes:
• Class A: 1.0.0.0 to 126.255.255.255 (Large networks)
• Class B: 128.0.0.0 to 191.255.255.255 (Medium networks)
• Class C: 192.0.0.0 to 223.255.255.255 (Small networks)
• Class D: 224.0.0.0 to 239.255.255.255 (Multicast)
• Class E: 240.0.0.0 to 255.255.255.255 (Experimental)

Private IP Ranges:
• Class A: 10.0.0.0 to 10.255.255.255
• Class B: 172.16.0.0 to 172.31.255.255
• Class C: 192.168.0.0 to 192.168.255.255

Subnetting:

Purpose:
• Divide large networks into smaller segments
• Improve security and performance
• Efficient IP address utilization
• Better network management

Subnet Mask:
• Separates network and host portions
• Uses consecutive 1s for network, 0s for host
• Common masks:
  - /24 = 255.255.255.0 (256 addresses)
  - /16 = 255.255.0.0 (65,536 addresses)
  - /8 = 255.0.0.0 (16,777,216 addresses)

CIDR (Classless Inter-Domain Routing):
• Modern approach replacing classful addressing
• Notation: 192.168.1.0/24
• /24 means first 24 bits are network portion
• Allows flexible subnet sizes

Quick Calculation Tips:
• /24 = 256 hosts
• /25 = 128 hosts
• /26 = 64 hosts
• /27 = 32 hosts
• /28 = 16 hosts
• /30 = 4 hosts (used for point-to-point links)`
  },
  {
    id: "cn-4",
    category: "Transport Layer",
    title: "Three-Way Handshake",
    difficulty: "MEDIUM",
    points: 2,
    description: "TCP connection establishment process",
    frequency: 88,
    companies: ["Google", "Amazon", "Meta", "Netflix", "Microsoft"],
    answer: `The Three-Way Handshake is the process TCP uses to establish a reliable connection.

Three Steps:

Step 1: SYN (Synchronize)
• Client sends SYN packet to server
• Contains initial sequence number (ISN)
• Client enters SYN_SENT state
• Message: "I want to connect"

Step 2: SYN-ACK (Synchronize-Acknowledge)
• Server responds with SYN-ACK packet
• Acknowledges client's SYN
• Sends its own sequence number
• Server enters SYN_RECEIVED state
• Message: "I received your request"

Step 3: ACK (Acknowledge)
• Client sends ACK packet
• Acknowledges server's SYN-ACK
• Connection established
• Both enter ESTABLISHED state
• Message: "Let's communicate"

Key Components:

Sequence Numbers:
• Random initial values for security
• Used for ordering and acknowledgment
• Incremented with each byte sent

Flags:
• SYN: Synchronize flag (initiates connection)
• ACK: Acknowledge flag (confirms receipt)
• Both flags can be set in same packet

Why Three Steps?
• Ensures both sides are ready to communicate
• Synchronizes sequence numbers for both directions
• Prevents old duplicate connections
• Establishes reliable, ordered communication channel

Security Implications:

SYN Flood Attack:
• Attacker sends many SYN packets
• Server allocates resources for each
• Exhausts server resources
• Mitigation: SYN cookies, rate limiting

Protection Mechanisms:
• TCP SYN cookies
• Connection timeout
• Resource limits
• Firewall filtering`
  },
  {
    id: "cn-5",
    category: "Transport Layer",
    title: "Congestion Control Algorithms",
    difficulty: "HARD",
    points: 3,
    description: "TCP congestion control: slow start, congestion avoidance",
    frequency: 65,
    companies: ["Google", "Amazon", "Netflix", "Meta", "Uber"],
    answer: `TCP Congestion Control prevents network congestion and ensures fair bandwidth allocation.

Four Main Algorithms:

1. Slow Start

Purpose:
• Initial phase of connection
• Rapidly find available bandwidth
• Prevent immediate network flooding

Mechanism:
• Start with small congestion window (cwnd)
• Initially cwnd = 1 MSS (Maximum Segment Size)
• Double cwnd for each ACK received
• Exponential growth: 1 → 2 → 4 → 8 → 16
• Continue until reaching ssthresh

2. Congestion Avoidance

Purpose:
• Conservative increase after slow start
• Probe for additional bandwidth safely

Mechanism:
• Triggered when cwnd >= ssthresh
• Linear increase: cwnd += 1 MSS per RTT
• Additive increase vs exponential
• More gradual bandwidth exploration

3. Fast Retransmit

Purpose:
• Quickly detect and recover from packet loss
• Don't wait for timeout

Mechanism:
• Sender tracks duplicate ACKs
• 3 duplicate ACKs indicate packet loss
• Immediately retransmit lost packet
• Don't wait for timeout expiration

4. Fast Recovery

Purpose:
• Recover from packet loss without slow start
• Maintain high throughput

Mechanism:
• After fast retransmit, enter fast recovery
• Set ssthresh = cwnd / 2
• Set cwnd = ssthresh + 3 MSS
• Inflate cwnd for each duplicate ACK
• When new ACK arrives, set cwnd = ssthresh

Packet Loss Scenarios:

Timeout (Severe Congestion):
• ssthresh = cwnd / 2
• cwnd = 1 MSS
• Restart with slow start

Triple Duplicate ACK (Mild Congestion):
• ssthresh = cwnd / 2
• cwnd = ssthresh + 3
• Fast retransmit + fast recovery

Modern Variants:

TCP Reno:
• Classic algorithm described above
• Fast retransmit + fast recovery

TCP Cubic:
• Default in Linux
• Cubic function for window growth
• Better performance on high-speed networks

TCP BBR:
• Developed by Google
• Model-based approach
• Optimizes for bottleneck bandwidth

Key Metrics:

Congestion Window (cwnd):
• Number of unacknowledged segments allowed
• Determines sending rate

Slow Start Threshold (ssthresh):
• Boundary between slow start and congestion avoidance
• Initially very high
• Reduced on congestion detection`
  },
  {
    id: "cn-6",
    category: "Transport Layer",
    title: "Flow Control Mechanisms",
    difficulty: "MEDIUM",
    points: 2,
    description: "Sliding window protocol and flow control",
    frequency: 72,
    companies: ["Microsoft", "Amazon", "Google", "Cisco", "Oracle"],
    answer: `Flow Control prevents sender from overwhelming receiver with data.

Sliding Window Protocol:

Purpose:
• Manage data flow between sender and receiver
• Allow multiple packets in flight
• Improve network utilization
• Prevent receiver buffer overflow

Window Size:
• Number of bytes receiver can accept
• Advertised in TCP header
• Dynamic adjustment based on buffer space
• Measured in bytes (not packets)

Send Window:
• Sender maintains send window
• Tracks unacknowledged data
• Cannot exceed receiver's advertised window
• Slides forward as ACKs arrive

Receive Window:
• Receiver maintains receive window
• Advertises available buffer space
• Accepts data within window
• Delivers in-order data to application

Operation:
• Sender transmits up to window size
• Receiver acknowledges received data
• Window slides forward
• Process repeats

Advantages:
• Efficient bandwidth utilization
• Multiple packets in flight
• Adaptive to network conditions
• Prevents buffer overflow

Zero Window:
• Receiver advertises window size 0
• Sender stops transmitting
• Waits for window update
• Periodic probes to check status`
  },
  {
    id: "cn-7",
    category: "Network Layer",
    title: "Routing Algorithms",
    difficulty: "MEDIUM",
    points: 2,
    description: "Distance vector and link state routing",
    frequency: 70,
    companies: ["Cisco", "Google", "Amazon", "Microsoft", "Juniper"],
    answer: `Routing algorithms determine the best path for data packets.

Distance Vector Routing:

Algorithm: Bellman-Ford
• Each router maintains routing table
• Shares table with neighbors only
• Updates based on neighbor information
• Counts hops as metric

Examples: RIP (Routing Information Protocol)

Advantages:
• Simple implementation
• Low overhead
• Works well in small networks

Disadvantages:
• Slow convergence
• Count-to-infinity problem
• Limited scalability

Link State Routing:

Algorithm: Dijkstra's shortest path
• Each router has complete network topology
• Floods link state information to all routers
• Calculates shortest path independently
• Uses bandwidth, delay as metrics

Examples: OSPF, IS-IS

Advantages:
• Fast convergence
• More accurate routing decisions
• Scales better
• No count-to-infinity

Disadvantages:
• Higher memory requirements
• More complex
• Higher CPU usage

Comparison:
• Distance Vector: "I heard from my neighbor"
• Link State: "I know the entire network"`
  },
  {
    id: "cn-8",
    category: "Network Layer",
    title: "IP Fragmentation",
    difficulty: "HARD",
    points: 3,
    description: "How IP fragmentation and reassembly works",
    frequency: 58,
    companies: ["Cisco", "Google", "Amazon", "Juniper", "Microsoft"],
    answer: `IP Fragmentation divides large packets to fit network MTU.

Maximum Transmission Unit (MTU):
• Maximum packet size for a link
• Ethernet MTU: 1500 bytes
• Varies by network technology
• Includes IP header

Fragmentation Process:

When Needed:
• Packet larger than link MTU
• Router fragments packet
• Each fragment is independent packet
• Can take different paths

Fragment Fields:
• Identification: Same for all fragments
• Flags: More Fragments (MF), Don't Fragment (DF)
• Fragment Offset: Position in original packet
• Total Length: Size of this fragment

Reassembly:
• Performed at destination only
• Uses identification field to group
• Fragment offset to order
• Waits for all fragments
• Timer for missing fragments

Problems:
• Performance overhead
• If one fragment lost, retransmit entire packet
• Security vulnerabilities
• NAT complications

Path MTU Discovery:
• Avoids fragmentation
• Sets DF (Don't Fragment) flag
• Receives ICMP message if too large
• Adjusts packet size accordingly
• More efficient than fragmentation`
  },
  {
    id: "cn-9",
    category: "Network Layer",
    title: "NAT and PAT",
    difficulty: "MEDIUM",
    points: 12,
    description: "Network Address Translation mechanisms",
    frequency: 75,
    companies: ["Cisco", "Amazon", "Google", "Microsoft", "Oracle"],
    answer: `NAT translates private IP addresses to public IPs.

Network Address Translation (NAT):

Purpose:
• Conserve public IP addresses
• Allow multiple devices behind single IP
• Provide security through obscurity
• Enable network design flexibility

Types:

Static NAT:
• One-to-one mapping
• Private IP ↔ Public IP
• Used for servers
• Predictable mapping

Dynamic NAT:
• Many-to-many mapping
• Pool of public IPs
• Assigned dynamically
• Released when connection ends

PAT (Port Address Translation):
• Many-to-one mapping
• Uses port numbers
• Most common type
• Also called NAT overload

PAT Operation:
• Translates private IP + port to public IP + unique port
• Maintains translation table
• Maps return traffic back
• Allows thousands of connections

Advantages:
• IP address conservation
• Additional security layer
• Network flexibility
• Simplified network design

Disadvantages:
• Breaks end-to-end connectivity
• Complications for peer-to-peer
• Performance overhead
• Troubleshooting difficulty
• Protocol complications`
  },
  {
    id: "cn-10",
    category: "Data Link Layer",
    title: "MAC Addressing",
    difficulty: "EASY",
    points: 1,
    description: "Media Access Control addressing",
    frequency: 80,
    companies: ["Cisco", "Google", "Microsoft", "Amazon", "Juniper"],
    answer: `MAC addresses provide physical addressing at data link layer.

Structure:
• 48-bit address (6 bytes)
• Format: XX:XX:XX:XX:XX:XX
• Hexadecimal notation
• Example: 00:1A:2B:3C:4D:5E

Components:
• First 24 bits: OUI (Organizationally Unique Identifier)
• Identifies manufacturer
• Last 24 bits: Device identifier
• Unique for each device

Types:
• Unicast: Single destination
• Broadcast: FF:FF:FF:FF:FF:FF
• Multicast: First byte odd

Purpose:
• Physical layer addressing
• Identifies network interface
• Used by switches for forwarding
• Layer 2 communication

MAC vs IP:
• MAC: Physical, unchangeable (usually)
• IP: Logical, configurable
• Both needed for communication
• ARP maps IP to MAC`
  },
  {
    id: "cn-11",
    category: "Network Basics",
    title: "HTTP vs HTTPS",
    difficulty: "EASY",
    points: 1,
    description: "Differences between HTTP and HTTPS protocols",
    frequency: 90,
    companies: ["Google", "Amazon", "Meta", "Netflix", "Microsoft"],
    answer: `HTTP and HTTPS are application layer protocols for web communication.

HTTP (Hypertext Transfer Protocol):

Characteristics:
• Unsecured protocol
• Data transmitted in plain text
• Port 80 by default
• No encryption
• Faster but insecure
• Vulnerable to attacks

Security Issues:
• Man-in-the-middle attacks
• Data interception
• No authentication
• No data integrity

HTTPS (HTTP Secure):

Characteristics:
• Secured version of HTTP
• Uses SSL/TLS for encryption
• Port 443 by default
• Encrypted communication
• Slightly slower but secure
• Authentication and integrity

Security Features:
• Encrypted data transmission
• SSL/TLS certificates
• Server authentication
• Data integrity protection
• Protection against tampering

SSL/TLS Handshake Process:
1. Client Hello: Initiates connection
2. Server Hello: Sends certificate
3. Certificate Verification
4. Key Exchange
5. Encrypted Communication

When to Use:
• HTTP: Public content, non-sensitive data
• HTTPS: Login pages, payment gateways, sensitive data, modern websites

SEO Impact:
• Google prioritizes HTTPS websites
• Browser warnings for HTTP sites
• User trust and credibility`
  },
  {
    id: "cn-12",
    category: "Application Layer",
    title: "DNS Resolution Process",
    difficulty: "MEDIUM",
    points: 2,
    description: "How Domain Name System resolves domain names to IP addresses",
    frequency: 82,
    companies: ["Google", "Amazon", "Cloudflare", "Microsoft", "Cisco"],
    answer: `DNS translates human-readable domain names into IP addresses.

DNS Hierarchy:

Root Servers:
• Top level of DNS hierarchy
• 13 root server clusters worldwide
• Stores information about TLD servers
• Represented by "."

TLD (Top-Level Domain) Servers:
• Manages .com, .org, .net, etc.
• Contains information about authoritative servers
• Second level in hierarchy

Authoritative Name Servers:
• Contains actual DNS records
• Provides final answer for domain
• Managed by domain owners

DNS Resolution Steps:

Step 1: Browser Cache Check
• Check if IP is cached locally
• If found, use cached IP

Step 2: OS Cache Check
• Check operating system cache
• If not found, proceed

Step 3: Recursive Resolver Query
• Query to ISP's DNS resolver
• Resolver performs lookup on behalf

Step 4: Root Server Query
• Resolver queries root server
• Root returns TLD server address

Step 5: TLD Server Query
• Query to TLD server (.com)
• Returns authoritative server address

Step 6: Authoritative Server Query
• Query to authoritative server
• Returns IP address

Step 7: Response to Client
• IP returned to browser
• Connection established

DNS Record Types:
• A Record: Domain to IPv4
• AAAA Record: Domain to IPv6
• CNAME: Canonical name (alias)
• MX: Mail server records
• NS: Name server records
• TXT: Text records

Caching:
• TTL (Time To Live) determines cache duration
• Reduces query load
• Faster subsequent lookups`
  },
  {
    id: "cn-13",
    category: "Network Layer",
    title: "IPv4 vs IPv6",
    difficulty: "MEDIUM",
    points: 2,
    description: "Differences between IPv4 and IPv6 protocols",
    frequency: 76,
    companies: ["Cisco", "Google", "Microsoft", "Amazon", "Juniper"],
    answer: `IPv4 and IPv6 are network layer protocols for addressing and routing.

IPv4 (Internet Protocol version 4):

Address Structure:
• 32-bit address
• Decimal notation: 192.168.1.1
• 4 octets separated by dots
• Total: ~4.3 billion addresses

Features:
• Address exhaustion problem
• Requires NAT for address conservation
• Optional security (IPSec)
• Manual or DHCP configuration
• Fragmentation by routers
• Broadcast support

Header:
• 20-60 bytes (variable)
• Complex header structure
• Options field available

IPv6 (Internet Protocol version 6):

Address Structure:
• 128-bit address
• Hexadecimal notation: 2001:0db8::1
• 8 groups of 4 hex digits
• Total: 340 undecillion addresses

Features:
• Abundant address space
• No need for NAT
• Built-in IPSec security
• Stateless auto-configuration
• No fragmentation by routers
• No broadcast (uses multicast)

Header:
• Fixed 40 bytes
• Simplified header structure
• Extension headers for options

Key Differences:

Address Space:
• IPv4: 2^32 addresses
• IPv6: 2^128 addresses

Configuration:
• IPv4: Manual/DHCP
• IPv6: Auto-configuration

Security:
• IPv4: Optional IPSec
• IPv6: Mandatory IPSec

Quality of Service:
• IPv4: Limited QoS
• IPv6: Built-in QoS

Transition Methods:
• Dual Stack: Support both protocols
• Tunneling: IPv6 over IPv4
• Translation: NAT64, DNS64`
  },
  {
    id: "cn-14",
    category: "Transport Layer",
    title: "TCP Connection Termination",
    difficulty: "MEDIUM",
    points: 2,
    description: "Four-way handshake for TCP connection closure",
    frequency: 68,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Oracle"],
    answer: `TCP connection termination uses a four-way handshake process.

Four-Way Handshake Steps:

Step 1: FIN from Client
• Client sends FIN (Finish) packet
• Indicates no more data to send
• Client enters FIN_WAIT_1 state
• Can still receive data

Step 2: ACK from Server
• Server acknowledges FIN
• Sends ACK packet
• Server enters CLOSE_WAIT state
• Client enters FIN_WAIT_2 state

Step 3: FIN from Server
• Server sends its FIN packet
• Indicates it's done sending data
• Server enters LAST_ACK state
• Client can now close receiving

Step 4: ACK from Client
• Client acknowledges server's FIN
• Sends final ACK
• Client enters TIME_WAIT state
• Server closes connection immediately
• Client closes after timeout (2MSL)

Connection States:

ESTABLISHED:
• Both sides exchanging data
• Normal operating state

FIN_WAIT_1:
• Sent FIN, waiting for ACK
• Can receive data

FIN_WAIT_2:
• Received ACK for FIN
• Waiting for peer's FIN

CLOSE_WAIT:
• Received FIN from peer
• Preparing to close

LAST_ACK:
• Sent FIN, waiting for ACK
• About to close

TIME_WAIT:
• Waiting for delayed packets
• 2 * MSL (Maximum Segment Lifetime)
• Typically 2-4 minutes

CLOSED:
• Connection fully terminated

Why Four Steps?
• TCP is full-duplex
• Each direction closes independently
• Ensures all data is received
• Graceful connection closure

Abnormal Termination:
• RST (Reset) packet
• Immediate connection abort
• No graceful closure
• Used for errors or timeouts`
  },
  {
    id: "cn-15",
    category: "Network Security",
    title: "Firewalls and Types",
    difficulty: "MEDIUM",
    points: 2,
    description: "Different types of firewalls and their working",
    frequency: 73,
    companies: ["Cisco", "Palo Alto", "Fortinet", "Amazon", "Microsoft"],
    answer: `Firewalls are security devices that monitor and control network traffic.

Types of Firewalls:

1. Packet Filtering Firewall

Function:
• Examines packet headers
• Checks source/destination IP and ports
• Allows or blocks based on rules
• Operates at Network layer

Advantages:
• Fast and efficient
• Low cost
• Minimal performance impact

Disadvantages:
• No application awareness
• Cannot inspect packet content
• Vulnerable to IP spoofing

2. Stateful Inspection Firewall

Function:
• Tracks connection states
• Maintains connection table
• Context-aware filtering
• Operates at Transport layer

Features:
• Remembers previous packets
• Validates packet sequences
• Better security than packet filtering

Advantages:
• More secure than packet filtering
• Dynamic port opening
• Connection tracking

3. Application Layer Firewall (Proxy)

Function:
• Deep packet inspection
• Application protocol awareness
• Operates at Application layer
• Acts as intermediary

Features:
• Content filtering
• URL filtering
• Malware detection
• User authentication

Advantages:
• Highest security level
• Protocol-specific inspection
• Hides internal network

Disadvantages:
• Performance overhead
• More complex configuration
• Higher cost

4. Next-Generation Firewall (NGFW)

Features:
• All traditional firewall features
• Intrusion Prevention System (IPS)
• Deep packet inspection
• Application awareness
• SSL/TLS inspection
• Threat intelligence

Capabilities:
• Advanced malware protection
• User identity tracking
• Cloud-based threat intelligence
• Granular application control

Firewall Rules:

Components:
• Source IP/network
• Destination IP/network
• Source port
• Destination port
• Protocol (TCP/UDP)
• Action (Allow/Deny)

Best Practices:
• Default deny policy
• Least privilege principle
• Regular rule audits
• Log monitoring
• Keep firmware updated`
  }
];

export const cnCategories = [
  "Network Basics",
  "Transport Layer",
  "Network Layer",
  "Data Link Layer",
  "Application Layer",
  "Network Security",
  "Wireless Networks"
];

// Helper functions
export const getQuestionById = (id: string): Question | undefined => {
  return cnQuestions.find(q => q.id === id);
};

export const getQuestionsByCategory = (category: string): Question[] => {
  return cnQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return cnQuestions.filter(q => q.difficulty === difficulty);
};

export const getHighFrequencyQuestions = (threshold: number = 80): Question[] => {
  return cnQuestions.filter(q => q.frequency >= threshold);
};
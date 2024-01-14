resource "aws_vpc" "my-vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name    = "my-vpc"
    Project = "cj-cafe"
  }
}

resource "aws_subnet" "subnet-1" {
  vpc_id            = aws_vpc.my-vpc.id
  availability_zone = "us-east-2a"
  cidr_block        = "10.0.1.0/24"

  tags = {
    Name    = "subnet-1"
    Project = "cj-cafe"
  }
}

resource "aws_subnet" "subnet-2" {
  vpc_id            = aws_vpc.my-vpc.id
  availability_zone = "us-east-2b"
  cidr_block        = "10.0.2.0/24" // must be different from subnet-1's cidr_block

  tags = {
    Name    = "subnet-2"
    Project = "cj-cafe"
  }
}

// Associate the Route Tables with the subnets
resource "aws_route_table_association" "subnet_1_association" {
  subnet_id      = aws_subnet.subnet-1.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "subnet_2_association" {
  subnet_id      = aws_subnet.subnet-2.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow web inbound traffic"
  vpc_id      = aws_vpc.my-vpc.id

  ingress {
    description = "HTTP (port 80)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS (port 443)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "ICMP (ping)"
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "allow_tls"
    Project = "cj-cafe"
  }
}

/* A security group is needed to allow the Load Balancer to access the ECS service.
   We want all traffic to the ECS service to come from the Load Balancer */
resource "aws_security_group" "allow_traffic_from_lb" {
  name        = "allow_traffic_from_lb"
  description = "Allow traffic from the Load Balancer to ECS service"
  vpc_id      = aws_vpc.my-vpc.id

  ingress {
    description = "Allow traffic from the Load Balancer on HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    security_groups = [aws_security_group.allow_web.id] /* Allow traffic from the Load Balancer to the ECS service */
  }

  ingress {
    description = "Allow traffic from the Load Balancer on HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    security_groups = [aws_security_group.allow_web.id] /* Allow traffic from the Load Balancer to the ECS service */
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

/*  
Attaching an internet gateway to the VPC is needed to allow services to access the internet
(e.g., for downloading updates or communicating with external services).
 */
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.my-vpc.id
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.my-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "public-route-table"
  }
}
import {
  Body,
  Container,
  Heading,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

/** Themed email sent via Resend when the contact form is submitted. */
export function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html lang="pt-BR">
      <Body
        style={{
          backgroundColor: "#0E0C12",
          color: "#EDE8DF",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            border: "1px solid #2B2535",
            borderRadius: "12px",
            backgroundColor: "#16131C",
            padding: "28px",
          }}
        >
          <Text
            style={{
              fontFamily: "monospace",
              color: "#E8A33D",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "12px",
              margin: 0,
            }}
          >
            {"// novo contato"}
          </Text>
          <Heading style={{ color: "#EDE8DF", fontSize: "22px" }}>
            {name}
          </Heading>
          <Text style={{ color: "#9A92A8", marginTop: "-8px" }}>{email}</Text>
          <Hr style={{ borderColor: "#2B2535" }} />
          <Section>
            <Text
              style={{
                color: "#EDE8DF",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

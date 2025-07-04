import React from "react";

interface TemplateProps {
  templateType: "template1" | "template2";
  children?: React.ReactNode;
  headerStyle?: React.CSSProperties;
  mainStyle?: React.CSSProperties;
  footerStyle?: React.CSSProperties;
  headerClass?: string;
  mainClass?: string;
  footerClass?: string;
  fontFamily?: string;
}

const Template: React.FC<TemplateProps> = ({ templateType, children, headerStyle, mainStyle, footerStyle, headerClass, mainClass, footerClass, fontFamily }) => {
  const templateStyles = {
    template1: {
      bgColors: "bg-white",
      justifyContent: "justify-center",
      flexDirection: "flex-row",
      header: "",
      footer: "",
    },
    template2: {
      bgColors: "bg-[#0a5366]",
      justifyContent: "justify-start",
      flexDirection: "",
      header: "",
      footer: "",
    },
  };

  const { bgColors, justifyContent, flexDirection, header, footer } = templateStyles[templateType] || templateStyles.template1;

  const renderMainContent = (type: string) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const { componentType } = child.props;
        if (type === componentType) {
          switch (type) {
            case "header":
              return <div className="header-wrapper">{child}</div>;
            case "footer":
              return <div className="footer-wrapper">{child}</div>;
            default:
              return child;
          }
        }
      }
      return null;
    });
  };

  return (
    <div className={`h-screen flex flex-col ${bgColors}`}>
      {/* Header */}
      <header className={`${justifyContent} ${headerClass} ${header} py-2 bg-[#0a5366]`} style={headerStyle}>
        {renderMainContent("header")}
      </header>

      {/* Main Content */}
      <main className={`flex-grow ${mainClass} ${flexDirection || "flex-col"} pt-10 px-5`} style={mainStyle}>
        <div className={`flex gap-x-5 w-full`}>
          {children && !React.Children.toArray(children).some((child) => React.isValidElement(child) && child.props.componentType === "none") && <div className=" w-[60%] flex flex-col items-start relative">{renderMainContent("main-right")}</div>}

          {/* main-left */}
          {renderMainContent("main-left") && (
            <div className={`${!renderMainContent("main-right") && ""} w-full`}>
              <div className="relative">{renderMainContent("main-left")}</div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={footerStyle} className={`${justifyContent} ${footerClass} ${footer} relative flex p-2 text-center bg-[#0a5366]`}>
        {renderMainContent("footer")}
      </footer>
    </div>
  );
};

export default Template;

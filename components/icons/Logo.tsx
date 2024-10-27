import React from "react";

import Image from "next/image";

function Logo() {
  return (
    <div>
      <Image src="/apml_logo.png" alt="apml logo" width={40} height={40} />
    </div>
  );
}

export default Logo;

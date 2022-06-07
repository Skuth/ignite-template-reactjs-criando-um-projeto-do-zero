import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

const Header: React.FC = () => {
  return (
    <nav className={`${styles.navbar} ${commonStyles.max__width}`}>
      <Link href="/" passHref>
        <a>
          <Image src="/logo.svg" alt="spacetraveling" width={238} height={25} />
        </a>
      </Link>
    </nav>
  );
};

export { Header };

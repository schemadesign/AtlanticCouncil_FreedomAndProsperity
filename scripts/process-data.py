INPUT = './../src/data/data.csv'
OUTPUT_DIR = './../src/data/processed/'
MANIFEST = OUTPUT_DIR + 'manifest.csv'
LATEST = OUTPUT_DIR + 'all-2022.csv'

def process_data():
    iso = ''
    header_rows = ''
    count = 0

    open(MANIFEST, 'w').writelines('ISO3,Name\n')

    with open(INPUT) as f:
        for line in f.readlines():
            if (count < 2):
                header_rows = line
            else:
                values = line.split(',')
                if (values[1] != iso):
                    iso = values[1]
                    filename = OUTPUT_DIR + 'by-country/' + str(iso) + '.csv';
                    open(MANIFEST, 'a').writelines(iso + ',' + values[0] + '\n')
                    open(filename, 'w').writelines(header_rows)
                open(filename, 'a').writelines(line)
                
                if (count == 2):
                    open(LATEST, 'w').writelines(header_rows)

                if (values[2] == '2022'):
                     open(LATEST, 'a').writelines(line)

            count += 1

if __name__ == "__main__":
    process_data()

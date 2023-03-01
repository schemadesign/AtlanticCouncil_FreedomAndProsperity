import shutil
import os

INPUT = './../src/data/data.csv'
OUTPUT_DIR = './../src/data/processed/'
BY_COUNTRY_DIR = OUTPUT_DIR + 'by-country/'
MANIFEST_BY_COUNTRY = OUTPUT_DIR + 'manifest_by_country.csv'
BY_INDICATOR_DIR = OUTPUT_DIR + 'by-indicator/'
MANIFEST_BY_INDICATOR = OUTPUT_DIR + 'manifest_by_indicator.csv'
LATEST = OUTPUT_DIR + 'latest_all_countries.csv'

def process_data():
    if not os.path.exists(OUTPUT_DIR):
        print('# create', OUTPUT_DIR)
        os.mkdir(OUTPUT_DIR)
    else:
        print('# clear', OUTPUT_DIR)
        shutil.rmtree(OUTPUT_DIR)
        os.mkdir(OUTPUT_DIR)

    print('# create', BY_COUNTRY_DIR)
    os.mkdir(BY_COUNTRY_DIR)

    print('# create', BY_INDICATOR_DIR)
    os.mkdir(BY_INDICATOR_DIR)

    open(MANIFEST_BY_COUNTRY, 'w').writelines('ISO3,Name\n')

    iso = ''
    header_row = ''
    count = 0
    with open(INPUT) as f:
        for line in f.readlines():
            if (count == 0):
                header_row = line

                cols = header_row.split(',')

                i = 0
                for col in cols:
                    col = col.strip()
                    filename = BY_INDICATOR_DIR + col + '.csv'
                    if (i > 2):
                        print('\t write', filename)
                        open(filename, 'w').writelines(cols[0] + ',' + cols[1] + ',' + cols[2] + ',' + cols[i])
                    i += 1
            else:
                values = line.split(',')
                
                if (values[1] != iso):
                    iso = values[1]
                    filename = BY_COUNTRY_DIR + str(iso) + '.csv'
                    print('\t write', filename)
                    open(MANIFEST_BY_COUNTRY, 'a').writelines(iso + ',' + values[0] + '\n')
                    open(filename, 'w').writelines(header_row)
                open(filename, 'a').writelines(line)
                
                if (count == 1):
                    open(LATEST, 'w').writelines(header_row)

                if (values[2] == '2022'):
                    open(LATEST, 'a').writelines(line)

                i = 0
                for col in cols:
                    col = col.strip()
                    indicator_filename = BY_INDICATOR_DIR + col + '.csv'
                    if (i > 2):
                        open(indicator_filename, 'a').writelines('\n' + values[0].strip() + ',' + values[1].strip() + ',' + values[2].strip() + ',' + values[i].strip())
                    i += 1

            count += 1
        
        print('\n\t write', LATEST)
        print('\n\t write', MANIFEST_BY_COUNTRY)

if __name__ == "__main__":
    process_data()
